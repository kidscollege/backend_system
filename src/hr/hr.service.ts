import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStaffDto } from './dto/create-staff.dto.js';
import { UpdateStaffDto } from './dto/update-staff.dto.js';
import { EmploymentStatus, Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  private async generateStaffNumber(): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await this.prisma.staff.count();
    const next = (count + 1).toString().padStart(4, '0');
    return `STF${year}${next}`; // e.g. STF260001
  }

  async create(dto: CreateStaffDto) {
    const createLogin = dto.createLogin === true;
    const email = dto.email?.toLowerCase();
    const role = dto.role || Role.TEACHER;
    let temporaryPassword: string | undefined;

    if (createLogin) {
      if (!email) {
        throw new BadRequestException('Email is required to create login');
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }

      temporaryPassword = randomBytes(9).toString('base64url');
    }

    const staffNumber = await this.generateStaffNumber();
    const passwordHash = temporaryPassword
      ? await bcrypt.hash(temporaryPassword, 10)
      : undefined;

    const result = await this.prisma.$transaction(async (transaction) => {
      const user = createLogin
        ? await transaction.user.create({
            data: {
              email: email!,
              passwordHash: passwordHash!,
              firstName: dto.firstName,
              lastName: dto.lastName,
              phone: dto.phone,
              role,
              isActive: true,
            },
          })
        : null;

      const staff = await transaction.staff.create({
        data: {
          userId: user?.id,
          staffNumber,
          firstName: dto.firstName,
          lastName: dto.lastName,
          middleName: dto.middleName,
          gender: dto.gender,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
          phone: dto.phone,
          email,
          address: dto.address,
          departmentId: dto.departmentId,
          designation: dto.designation,
          employmentDate: dto.employmentDate
            ? new Date(dto.employmentDate)
            : new Date(),
          status: dto.status || EmploymentStatus.ACTIVE,
        },
        include: {
          department: true,
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isActive: true,
            },
          },
        },
      });

      return staff;
    });

    return {
      staff: result,
      login: createLogin
        ? {
            email,
            temporaryPassword,
            role,
          }
        : null,
    };
  }

  async findAll(search?: string, status?: EmploymentStatus, departmentId?: string) {
    const where: Prisma.StaffWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { staffNumber: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    return this.prisma.staff.findMany({
      where,
      include: {
        department: true,
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
  }

  async findOne(id: string) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: {
        department: true,
        classSubjects: {
          include: {
            class: true,
            subject: true,
            section: true,
          },
        },
      },
    });

    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    return staff;
  }

  async update(id: string, dto: UpdateStaffDto) {
    await this.findOne(id);

    const data: any = { ...dto };

    if (dto.dateOfBirth) {
      data.dateOfBirth = new Date(dto.dateOfBirth);
    }
    if (dto.employmentDate) {
      data.employmentDate = new Date(dto.employmentDate);
    }

    return this.prisma.staff.update({
      where: { id },
      data,
      include: {
        department: true,
      },
    });
  }

  async changeStatus(id: string, status: EmploymentStatus) {
    await this.findOne(id);

    return this.prisma.staff.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Soft delete by changing status
    return this.prisma.staff.update({
      where: { id },
      data: { status: EmploymentStatus.TERMINATED },
    });
  }
}