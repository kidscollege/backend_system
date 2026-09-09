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