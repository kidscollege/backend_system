import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MarkAttendanceDto } from './dto/mark-attendance.dto.js';
import { BulkMarkAttendanceDto } from './dto/bulk-mark-attendance.dto.js';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async markAttendance(dto: MarkAttendanceDto, markedById?: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });
    if (!student) throw new NotFoundException('Student not found');

    const term = await this.prisma.term.findUnique({
      where: { id: dto.termId },
    });
    if (!term) throw new NotFoundException('Term not found');

    const date = new Date(dto.date);

    return this.prisma.attendanceRecord.upsert({
      where: {
        studentId_date: {
          studentId: dto.studentId,
          date,
        },
      },
      update: {
        status: dto.status,
        remark: dto.remark,
        termId: dto.termId,
        markedById,
      },
      create: {
        studentId: dto.studentId,
        termId: dto.termId,
        date,
        status: dto.status,
        remark: dto.remark,
        markedById,
      },
      include: {
        student: {
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async bulkMarkAttendance(dto: BulkMarkAttendanceDto, markedById?: string) {
    const term = await this.prisma.term.findUnique({
      where: { id: dto.termId },
    });
    if (!term) throw new NotFoundException('Term not found');

    const date = new Date(dto.date);
    const results = [];

    for (const record of dto.records) {
      const saved = await this.prisma.attendanceRecord.upsert({
        where: {
          studentId_date: {
            studentId: record.studentId,
            date,
          },
        },
        update: {
          status: record.status,
          remark: record.remark,
          termId: dto.termId,
          markedById,
        },
        create: {
          studentId: record.studentId,
          termId: dto.termId,
          date,
          status: record.status,
          remark: record.remark,
          markedById,
        },
      });

      results.push(saved);
    }

    return {
      message: `${results.length} attendance records saved`,
      count: results.length,
      date: dto.date,
    };
  }

  async getStudentAttendance(studentId: string, termId?: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) throw new NotFoundException('Student not found');

    const records = await this.prisma.attendanceRecord.findMany({
      where: {
        studentId,
        ...(termId && { termId }),
      },
      orderBy: { date: 'desc' },
    });

    // Summary
    const summary = {
      present: records.filter((r) => r.status === AttendanceStatus.PRESENT).length,
      absent: records.filter((r) => r.status === AttendanceStatus.ABSENT).length,
      late: records.filter((r) => r.status === AttendanceStatus.LATE).length,
      excused: records.filter((r) => r.status === AttendanceStatus.EXCUSED).length,
      total: records.length,
    };

    return {
      student: {
        id: student.id,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
      },
      summary,
      records,
    };
  }

  async getClassAttendance(classId: string, date: string, termId: string) {
    const students = await this.prisma.student.findMany({
      where: {
        currentClassId: classId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        admissionNumber: true,
        firstName: true,
        lastName: true,
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });

    const attendanceDate = new Date(date);

    const records = await this.prisma.attendanceRecord.findMany({
      where: {
        termId,
        date: attendanceDate,
        studentId: { in: students.map((s) => s.id) },
      },
    });

    const recordMap = new Map(records.map((r) => [r.studentId, r]));

    const result = students.map((student) => {
      const record = recordMap.get(student.id);
      return {
        student,
        status: record?.status ?? null,
        remark: record?.remark ?? null,
      };
    });

    return {
      classId,
      date,
      termId,
      attendance: result,
    };
  }

  async getAttendanceByDate(date: string, termId: string) {
    return this.prisma.attendanceRecord.findMany({
      where: {
        date: new Date(date),
        termId,
      },
      include: {
        student: {
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            lastName: true,
            currentClass: true,
          },
        },
      },
      orderBy: {
        student: { lastName: 'asc' },
      },
    });
  }
}