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

@Injectable()
export class AcademicsService {
  constructor(private prisma: PrismaService) {}

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

  // ======================
  // TERM
  // ======================

  async createTerm(dto: CreateTermDto) {
    const session = await this.prisma.academicSession.findUnique({
      where: { id: dto.sessionId },
    });

    if (!session) {
      throw new NotFoundException('Academic session not found');
    }

    if (dto.isCurrent) {
      await this.prisma.term.updateMany({
        where: { sessionId: dto.sessionId, isCurrent: true },
        data: { isCurrent: false },
      });
    }

    return this.prisma.term.create({
      data: {
        sessionId: dto.sessionId,
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isCurrent: dto.isCurrent ?? false,
      },
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
}