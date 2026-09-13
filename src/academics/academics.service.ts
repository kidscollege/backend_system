import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { CreateTermDto } from './dto/create-term.dto.js';
import { CreateDepartmentDto } from './dto/create-department.dto.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { CreateSectionDto } from './dto/create-section.dto.js';
import { CreateTimetableEntryDto } from './dto/create-timetable-entry.dto.js';

@Injectable()
export class AcademicsService {
  constructor(private prisma: PrismaService) {}

  private timeToMinutes(value: string) {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private async validateTimetableEntry(dto: CreateTimetableEntryDto, excludeId?: string) {
    if (this.timeToMinutes(dto.endTime) <= this.timeToMinutes(dto.startTime)) {
      throw new BadRequestException('End time must be after start time');
    }

    const [session, term, classRecord, subject, teacher, section] = await Promise.all([
      this.prisma.academicSession.findUnique({ where: { id: dto.sessionId } }),
      dto.termId ? this.prisma.term.findUnique({ where: { id: dto.termId } }) : null,
      this.prisma.class.findUnique({ where: { id: dto.classId } }),
      this.prisma.subject.findUnique({ where: { id: dto.subjectId } }),
      this.prisma.staff.findUnique({ where: { id: dto.teacherId } }),
      dto.sectionId ? this.prisma.classSection.findUnique({ where: { id: dto.sectionId } }) : null,
    ]);

    if (!session) throw new NotFoundException('Academic session not found');
    if (dto.termId && (!term || term.sessionId !== dto.sessionId)) throw new BadRequestException('Term does not belong to the selected session');
    if (!classRecord || classRecord.sessionId !== dto.sessionId) throw new BadRequestException('Class does not belong to the selected session');
    if (!subject) throw new NotFoundException('Subject not found');
    if (!teacher) throw new NotFoundException('Teacher not found');
    if (dto.sectionId && (!section || section.classId !== dto.classId)) throw new BadRequestException('Section does not belong to the selected class');

    const entries = await this.prisma.timetableEntry.findMany({
      where: {
        sessionId: dto.sessionId,
        dayOfWeek: dto.dayOfWeek,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    const start = this.timeToMinutes(dto.startTime);
    const end = this.timeToMinutes(dto.endTime);
    const overlaps = (entry: (typeof entries)[number]) => start < this.timeToMinutes(entry.endTime) && end > this.timeToMinutes(entry.startTime);
    const classClash = entries.some((entry) => entry.classId === dto.classId && (!dto.sectionId || !entry.sectionId || entry.sectionId === dto.sectionId) && overlaps(entry));
    const teacherClash = entries.some((entry) => entry.teacherId === dto.teacherId && overlaps(entry));
    const roomClash = dto.room?.trim() && entries.some((entry) => entry.room?.toLowerCase() === dto.room?.trim().toLowerCase() && overlaps(entry));
    if (classClash) throw new BadRequestException('This class already has a timetable entry during that period');
    if (teacherClash) throw new BadRequestException('This teacher is already scheduled during that period');
    if (roomClash) throw new BadRequestException('This room is already booked during that period');
  }

  async getTimetable(filters: { sessionId?: string; termId?: string; classId?: string; teacherId?: string }) {
    return this.prisma.timetableEntry.findMany({
      where: {
        isActive: true,
        ...(filters.teacherId ? { isPublished: true } : {}),
        ...(filters.sessionId ? { sessionId: filters.sessionId } : {}),
        ...(filters.termId ? { termId: filters.termId } : {}),
        ...(filters.classId ? { classId: filters.classId } : {}),
        ...(filters.teacherId ? { teacherId: filters.teacherId } : {}),
      },
      include: { session: true, term: true, class: true, section: true, subject: true, teacher: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async createTimetableEntry(dto: CreateTimetableEntryDto) {
    await this.validateTimetableEntry(dto);
    return this.prisma.timetableEntry.create({
      data: dto,
      include: { session: true, term: true, class: true, section: true, subject: true, teacher: true },
    });
  }

  async updateTimetableEntry(id: string, dto: CreateTimetableEntryDto) {
    const existing = await this.prisma.timetableEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Timetable entry not found');
    await this.validateTimetableEntry(dto, id);
    return this.prisma.timetableEntry.update({
      where: { id },
      data: dto,
      include: { session: true, term: true, class: true, section: true, subject: true, teacher: true },
    });
  }

  async deleteTimetableEntry(id: string) {
    const existing = await this.prisma.timetableEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Timetable entry not found');
    return this.prisma.timetableEntry.update({ where: { id }, data: { isActive: false } });
  }

  async setTimetablePublished(id: string, isPublished: boolean) {
    const existing = await this.prisma.timetableEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Timetable entry not found');

    return this.prisma.timetableEntry.update({
      where: { id },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });
  }

  // ======================
  // ACADEMIC SESSION
  // ======================

  async createSession(dto: CreateSessionDto) {
    // Get the default school (we seeded one earlier)
    const school = await this.prisma.school.findFirst();
    if (!school) {
      throw new BadRequestException('No school found. Please create a school first.');
    }

    // If this session is marked as current, unset other current sessions
    if (dto.isCurrent) {
      await this.prisma.academicSession.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    return this.prisma.academicSession.create({
      data: {
        schoolId: school.id,
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isCurrent: dto.isCurrent ?? false,
      },
    });
  }

  async getSessions() {
    return this.prisma.academicSession.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        terms: true,
        _count: { select: { classes: true, students: true } },
      },
    });
  }

  async getCurrentSession() {
    const session = await this.prisma.academicSession.findFirst({
      where: { isCurrent: true },
      include: { terms: true },
    });

    if (!session) {
      throw new NotFoundException('No current academic session found');
    }

    return session;
  }


  async assignTeacher(data: {
  classId: string;
  subjectId: string;
  teacherId: string; // Staff.id
  sectionId?: string;
}) {
  if (!data.classId || !data.subjectId || !data.teacherId) {
    throw new BadRequestException('classId, subjectId and teacherId are required');
  }

  const [classExists, subjectExists, teacherExists] = await Promise.all([
    this.prisma.class.findUnique({ where: { id: data.classId } }),
    this.prisma.subject.findUnique({ where: { id: data.subjectId } }),
    this.prisma.staff.findUnique({ where: { id: data.teacherId } }),
  ]);

  if (!classExists) throw new NotFoundException('Class not found');
  if (!subjectExists) throw new NotFoundException('Subject not found');
  if (!teacherExists) throw new NotFoundException('Teacher/staff not found');

  const existing = await this.prisma.classSubject.findFirst({
    where: {
      classId: data.classId,
      subjectId: data.subjectId,
      sectionId: data.sectionId || null,
    },
  });

  if (existing) {
    return this.prisma.classSubject.update({
      where: { id: existing.id },
      data: { teacherId: data.teacherId },
      include: {
        class: true,
        subject: true,
        teacher: true,
        section: true,
      },
    });
  }

  return this.prisma.classSubject.create({
    data: {
      classId: data.classId,
      subjectId: data.subjectId,
      teacherId: data.teacherId,
      sectionId: data.sectionId || null,
    },
    include: {
      class: true,
      subject: true,
      teacher: true,
      section: true,
    },
  });
}

async getClassSubjects(classId?: string) {
  return this.prisma.classSubject.findMany({
    where: classId ? { classId } : undefined,
    include: {
      class: true,
      subject: true,
      teacher: true,
      section: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
  // ======================
  // TERM
  // ======================

 // create term
async createTerm(data: {
  sessionId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}) {
  return this.prisma.term.create({
    data: {
      sessionId: data.sessionId,
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isCurrent: data.isCurrent || false,
    },
  });
}

async getTerms(sessionId?: string) {
  return this.prisma.term.findMany({
    where: sessionId ? { sessionId } : undefined,
    include: { session: true },
    orderBy: { startDate: 'desc' },
  });
}





  
  async getTermsBySession(sessionId: string) {
    return this.prisma.term.findMany({
      where: { sessionId },
      orderBy: { startDate: 'asc' },
    });
  }

  // ======================
  // DEPARTMENT
  // ======================

  async createDepartment(dto: CreateDepartmentDto) {
    const school = await this.prisma.school.findFirst();
    if (!school) {
      throw new BadRequestException('No school found');
    }

    return this.prisma.department.create({
      data: {
        schoolId: school.id,
        name: dto.name,
        code: dto.code,
      },
    });
  }

  async getDepartments() {
    return this.prisma.department.findMany({
      include: {
        _count: { select: { subjects: true, staff: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  // ======================
  // SUBJECT
  // ======================

  async createSubject(dto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        departmentId: dto.departmentId,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async getSubjects() {
    return this.prisma.subject.findMany({
      where: { isActive: true },
      include: { department: true },
      orderBy: { name: 'asc' },
    });
  }

  // ======================
  // CLASS
  // ======================

  async createClass(dto: CreateClassDto) {
    const session = await this.prisma.academicSession.findUnique({
      where: { id: dto.sessionId },
    });

    if (!session) {
      throw new NotFoundException('Academic session not found');
    }

    return this.prisma.class.create({
      data: {
        sessionId: dto.sessionId,
        name: dto.name,
        level: dto.level,
        capacity: dto.capacity,
        campusId: dto.campusId,
      },
      include: {
        sections: true,
        session: true,
      },
    });
  }

  async getClasses(sessionId?: string) {
    return this.prisma.class.findMany({
      where: sessionId ? { sessionId } : undefined,
      include: {
        sections: true,
        session: true,
        _count: { select: { students: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  // ======================
  // CLASS SECTION
  // ======================

  async createSection(dto: CreateSectionDto) {
    const classExists = await this.prisma.class.findUnique({
      where: { id: dto.classId },
    });

    if (!classExists) {
      throw new NotFoundException('Class not found');
    }

    return this.prisma.classSection.create({
      data: {
        classId: dto.classId,
        name: dto.name,
      },
    });
  }

  async getSectionsByClass(classId: string) {
    return this.prisma.classSection.findMany({
      where: { classId },
      orderBy: { name: 'asc' },
    });
  }
    // ======================
  // UPDATE & DELETE
  // ======================

  async updateSession(id: string, dto: CreateSessionDto) {
    const session = await this.prisma.academicSession.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Session not found');

    if (dto.isCurrent) {
      await this.prisma.academicSession.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    return this.prisma.academicSession.update({
      where: { id },
      data: {
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isCurrent: dto.isCurrent ?? session.isCurrent,
      },
    });
  }

  async deleteSession(id: string) {
    const session = await this.prisma.academicSession.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Session not found');

    return this.prisma.academicSession.delete({ where: { id } });
  }

  async updateClass(id: string, dto: CreateClassDto) {
    const classExists = await this.prisma.class.findUnique({ where: { id } });
    if (!classExists) throw new NotFoundException('Class not found');

    return this.prisma.class.update({
      where: { id },
      data: {
        name: dto.name,
        level: dto.level,
        capacity: dto.capacity,
        sessionId: dto.sessionId,
        campusId: dto.campusId,
      },
      include: { session: true, sections: true },
    });
  }

  async deleteClass(id: string) {
    const classExists = await this.prisma.class.findUnique({ where: { id } });
    if (!classExists) throw new NotFoundException('Class not found');

    return this.prisma.class.delete({ where: { id } });
  }

  async updateSubject(id: string, dto: CreateSubjectDto) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');

    return this.prisma.subject.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        departmentId: dto.departmentId,
        isActive: dto.isActive ?? subject.isActive,
      },
    });
  }

  async deleteSubject(id: string) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');

    return this.prisma.subject.delete({ where: { id } });
  }
}