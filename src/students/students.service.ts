import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { QueryStudentsDto } from './dto/query-students.dto.js';
import { Prisma, StudentStatus } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  private async generateAdmissionNumber(): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await this.prisma.student.count();
    const nextNumber = (count + 1).toString().padStart(4, '0');
    return `ADM${year}${nextNumber}`; // e.g. ADM260001
  }

  async create(dto: CreateStudentDto) {
    const admissionNumber = await this.generateAdmissionNumber();

    // Create student + optional parent in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: {
          admissionNumber,
          firstName: dto.firstName,
          lastName: dto.lastName,
          middleName: dto.middleName,
          gender: dto.gender,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
          bloodGroup: dto.bloodGroup,
          nationality: dto.nationality || 'Nigerian',
          religion: dto.religion,
          address: dto.address,
          status: dto.status || StudentStatus.ACTIVE,
          admissionDate: dto.admissionDate
            ? new Date(dto.admissionDate)
            : new Date(),
          currentClassId: dto.currentClassId,
          currentSectionId: dto.currentSectionId,
          sessionId: dto.sessionId,
        },
      });

      // Create parent if provided
      if (dto.parentFirstName && dto.parentLastName) {
        const parent = await tx.parent.create({
          data: {
            firstName: dto.parentFirstName,
            lastName: dto.parentLastName,
            phone: dto.parentPhone,
            email: dto.parentEmail,
          },
        });

        await tx.studentGuardian.create({
          data: {
            studentId: student.id,
            parentId: parent.id,
            relationship: dto.relationship || 'Guardian',
            isPrimary: true,
          },
        });
      }

      return student;
    });

    return this.findOne(result.id);
  }

  async findAll(query: QueryStudentsDto) {
    const { search, status, classId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.StudentWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { admissionNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (classId) {
      where.currentClassId = classId;
    }

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          currentClass: true,
          currentSection: true,
          guardians: {
            include: {
              parent: true,
            },
          },
        },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        currentClass: true,
        currentSection: true,
        session: true,
        guardians: {
          include: {
            parent: true,
          },
        },
        documents: true,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async update(id: string, dto: UpdateStudentDto) {
    await this.findOne(id); // check exists

    const data: any = { ...dto };

    if (dto.dateOfBirth) {
      data.dateOfBirth = new Date(dto.dateOfBirth);
    }
    if (dto.admissionDate) {
      data.admissionDate = new Date(dto.admissionDate);
    }

    // Remove parent fields (we handle them separately later if needed)
    delete data.parentFirstName;
    delete data.parentLastName;
    delete data.parentPhone;
    delete data.parentEmail;
    delete data.relationship;

    const student = await this.prisma.student.update({
      where: { id },
      data,
      include: {
        currentClass: true,
        currentSection: true,
        guardians: {
          include: { parent: true },
        },
      },
    });

    return student;
  }

  async changeStatus(id: string, status: StudentStatus) {
    await this.findOne(id);

    return this.prisma.student.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Soft delete by changing status instead of hard delete
    return this.prisma.student.update({
      where: { id },
      data: { status: StudentStatus.WITHDRAWN },
    });
  }
}