import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  private async getStaffProfile(userId: string) {
    const staff = await this.prisma.staff.findFirst({
      where: { userId },
    });

    if (!staff) {
      throw new NotFoundException('Teacher profile not found');
    }

    return staff;
  }

  async getDashboard(userId: string) {
    const staff = await this.getStaffProfile(userId);

    const assignments = await this.prisma.classSubject.findMany({
      where: { teacherId: staff.id },
      include: {
        class: true,
        section: true,
        subject: true,
      },
    });

    return {
      teacher: {
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        staffNumber: staff.staffNumber,
        designation: staff.designation,
      },
      assignmentsCount: assignments.length,
      assignments: assignments.map((a) => ({
        id: a.id,
        classId: a.classId,
        className: a.class?.name,
        sectionId: a.sectionId,
        sectionName: a.section?.name,
        subjectId: a.subjectId,
        subjectName: a.subject?.name,
      })),
    };
  }

  async getAssignments(userId: string) {
    const staff = await this.getStaffProfile(userId);

    return this.prisma.classSubject.findMany({
      where: { teacherId: staff.id },
      include: {
        class: true,
        section: true,
        subject: true,
      },
    });
  }

  async getClassStudents(userId: string, classId: string, sectionId?: string) {
    const staff = await this.getStaffProfile(userId);

    // Ensure teacher is assigned to this class
    const assigned = await this.prisma.classSubject.findFirst({
      where: {
        teacherId: staff.id,
        classId,
        ...(sectionId ? { sectionId } : {}),
      },
    });

    if (!assigned) {
      throw new ForbiddenException('You are not assigned to this class');
    }

    return this.prisma.student.findMany({
      where: {
        currentClassId: classId,
        ...(sectionId ? { currentSectionId: sectionId } : {}),
        status: 'ACTIVE',
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: {
        id: true,
        admissionNumber: true,
        firstName: true,
        lastName: true,
        middleName: true,
        gender: true,
      },
    });
  }
  
  async getTerms() {
  return this.prisma.term.findMany({
    orderBy: { startDate: 'desc' },
  });
}

async getAssessments(
  userId: string,
  subjectId: string,
  termId: string,
) {
  const staff = await this.getStaffProfile(userId);

  const assigned = await this.prisma.classSubject.findFirst({
    where: {
      teacherId: staff.id,
      subjectId,
    },
  });

  if (!assigned) {
    throw new ForbiddenException('You are not assigned to this subject');
  }

  return this.prisma.assessment.findMany({
    where: { subjectId, termId },
    orderBy: { createdAt: 'desc' },
  });
}

async createAssessment(
  userId: string,
  data: {
    subjectId: string;
    termId: string;
    name: string;
    maxScore: number;
    weight?: number;
    assessmentDate?: string;
  },
) {
  const staff = await this.getStaffProfile(userId);

  const assigned = await this.prisma.classSubject.findFirst({
    where: {
      teacherId: staff.id,
      subjectId: data.subjectId,
    },
  });

  if (!assigned) {
    throw new ForbiddenException('You are not assigned to this subject');
  }

  return this.prisma.assessment.create({
    data: {
      subjectId: data.subjectId,
      termId: data.termId,
      name: data.name,
      maxScore: Number(data.maxScore),
      weight: data.weight != null ? Number(data.weight) : null,
      assessmentDate: data.assessmentDate
        ? new Date(data.assessmentDate)
        : null,
    },
  });
}

async getAssessmentScores(
  userId: string,
  assessmentId: string,
  classId: string,
  sectionId?: string,
) {
  const staff = await this.getStaffProfile(userId);

  const assessment = await this.prisma.assessment.findUnique({
    where: { id: assessmentId },
  });
  if (!assessment) throw new NotFoundException('Assessment not found');

  const assigned = await this.prisma.classSubject.findFirst({
    where: {
      teacherId: staff.id,
      classId,
      subjectId: assessment.subjectId,
    },
  });
  if (!assigned) {
    throw new ForbiddenException('You are not assigned to this class/subject');
  }

  const students = await this.prisma.student.findMany({
    where: {
      currentClassId: classId,
      ...(sectionId ? { currentSectionId: sectionId } : {}),
      status: 'ACTIVE',
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });

  const scores = await this.prisma.studentAssessment.findMany({
    where: {
      assessmentId,
      studentId: { in: students.map((s) => s.id) },
    },
  });

  const map = new Map(scores.map((s) => [s.studentId, s]));

  return {
    assessment,
    rows: students.map((s) => ({
      studentId: s.id,
      admissionNumber: s.admissionNumber,
      firstName: s.firstName,
      lastName: s.lastName,
      score: map.get(s.id)?.score ?? null,
      remark: map.get(s.id)?.remark ?? null,
    })),
  };
}

async saveAssessmentScores(
  userId: string,
  data: {
    assessmentId: string;
    classId: string;
    sectionId?: string;
    scores: { studentId: string; score?: number | null; remark?: string }[];
  },
) {
  const staff = await this.getStaffProfile(userId);

  const assessment = await this.prisma.assessment.findUnique({
    where: { id: data.assessmentId },
  });
  if (!assessment) throw new NotFoundException('Assessment not found');

  const assigned = await this.prisma.classSubject.findFirst({
    where: {
      teacherId: staff.id,
      classId: data.classId,
      subjectId: assessment.subjectId,
    },
  });
  if (!assigned) {
    throw new ForbiddenException('You are not assigned to this class/subject');
  }

  const ops = data.scores.map((row) =>
    this.prisma.studentAssessment.upsert({
      where: {
        studentId_assessmentId: {
          studentId: row.studentId,
          assessmentId: data.assessmentId,
        },
      },
      update: {
        score: row.score == null || row.score === ('' as any)
          ? null
          : Number(row.score),
        remark: row.remark || null,
      },
      create: {
        studentId: row.studentId,
        assessmentId: data.assessmentId,
        score: row.score == null || row.score === ('' as any)
          ? null
          : Number(row.score),
        remark: row.remark || null,
      },
    }),
  );

  await this.prisma.$transaction(ops);

  return { message: 'Scores saved successfully', count: data.scores.length };
}

async getAttendanceByDate(
  userId: string,
  classId: string,
  date: string,
  sectionId?: string,
) {
  const staff = await this.getStaffProfile(userId);

  const assigned = await this.prisma.classSubject.findFirst({
    where: {
      teacherId: staff.id,
      classId,
      ...(sectionId ? { sectionId } : {}),
    },
  });

  if (!assigned) {
    throw new ForbiddenException('You are not assigned to this class');
  }

  const students = await this.prisma.student.findMany({
    where: {
      currentClassId: classId,
      ...(sectionId ? { currentSectionId: sectionId } : {}),
      status: 'ACTIVE',
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });

  const records = await this.prisma.attendanceRecord.findMany({
    where: {
      date: new Date(date),
      studentId: { in: students.map((s) => s.id) },
    },
  });

  const map = new Map(records.map((r) => [r.studentId, r]));

  return students.map((s) => ({
    studentId: s.id,
    admissionNumber: s.admissionNumber,
    firstName: s.firstName,
    lastName: s.lastName,
    status: map.get(s.id)?.status || null,
    remark: map.get(s.id)?.remark || null,
    recordId: map.get(s.id)?.id || null,
  }));
}
  async markAttendance(
    userId: string,
    data: {
      classId: string;
      sectionId?: string;
      termId: string;
      date: string;
      records: { studentId: string; status: AttendanceStatus; remark?: string }[];
    },
  ) {
    const staff = await this.getStaffProfile(userId);

    const assigned = await this.prisma.classSubject.findFirst({
      where: {
        teacherId: staff.id,
        classId: data.classId,
      },
    });

    if (!assigned) {
      throw new ForbiddenException('You are not assigned to this class');
    }

    if (!data.records?.length) {
      throw new BadRequestException('No attendance records provided');
    }

    const date = new Date(data.date);

    const ops = data.records.map((r) =>
      this.prisma.attendanceRecord.upsert({
        where: {
          studentId_date: {
            studentId: r.studentId,
            date,
          },
        },
        update: {
          status: r.status,
          remark: r.remark,
          termId: data.termId,
          markedById: staff.id,
        },
        create: {
          studentId: r.studentId,
          termId: data.termId,
          date,
          status: r.status,
          remark: r.remark,
          markedById: staff.id,
        },
      }),
    );

    await this.prisma.$transaction(ops);

    return { message: 'Attendance saved successfully', count: data.records.length };
  }
}