import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ParentService {
  constructor(private prisma: PrismaService) {}

  private async getParentRecord(userId: string) {
    const parent = await this.prisma.parent.findFirst({
      where: { userId },
    });

    if (!parent) {
      throw new NotFoundException('Parent profile not found');
    }

    return parent;
  }

  private async getParentChildren(parentId: string) {
    return this.prisma.studentGuardian.findMany({
      where: { parentId },
      include: {
        student: {
          include: {
            currentClass: true,
            currentSection: true,
          },
        },
      },
    });
  }

  async getDashboard(userId: string) {
    const parent = await this.getParentRecord(userId);
    const links = await this.getParentChildren(parent.id);
    const children = links.map((g) => g.student);

    return {
      parent: {
        id: parent.id,
        firstName: parent.firstName,
        lastName: parent.lastName,
        email: parent.email,
        phone: parent.phone,
      },
      childrenCount: children.length,
      children: children.map((child) => ({
        id: child.id,
        admissionNumber: child.admissionNumber,
        firstName: child.firstName,
        lastName: child.lastName,
        className: child.currentClass?.name || null,
        sectionName: child.currentSection?.name || null,
        status: child.status,
      })),
    };
  }

  async getChildren(userId: string) {
    const parent = await this.getParentRecord(userId);
    const links = await this.getParentChildren(parent.id);

    return links.map((g) => ({
      relationship: g.relationship,
      isPrimary: g.isPrimary,
      student: {
        id: g.student.id,
        admissionNumber: g.student.admissionNumber,
        firstName: g.student.firstName,
        lastName: g.student.lastName,
        middleName: g.student.middleName,
        gender: g.student.gender,
        className: g.student.currentClass?.name || null,
        sectionName: g.student.currentSection?.name || null,
        status: g.student.status,
      },
    }));
  }

  private async assertParentOwnsStudent(userId: string, studentId: string) {
    const parent = await this.getParentRecord(userId);

    const owned = await this.prisma.studentGuardian.findFirst({
      where: {
        parentId: parent.id,
        studentId,
      },
    });

    if (!owned) {
      throw new ForbiddenException('You do not have access to this student');
    }
  }

  async getChildAttendance(userId: string, studentId: string) {
    await this.assertParentOwnsStudent(userId, studentId);

    return this.prisma.attendanceRecord.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
      take: 60,
      include: {
        term: true,
      },
    });
  }

  async getChildResults(userId: string, studentId: string) {
    await this.assertParentOwnsStudent(userId, studentId);

    return this.prisma.studentAssessment.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        assessment: {
          include: {
            subject: true,
            term: true,
          },
        },
      },
    });
  }

  async getChildInvoices(userId: string, studentId: string) {
    await this.assertParentOwnsStudent(userId, studentId);

    return this.prisma.feeInvoice.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        payments: true,
      },
    });
  }
}