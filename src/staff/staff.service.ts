import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EmploymentStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.staff.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        department: true,
      },
    });
  }

  private async generateStaffNumber() {
    const count = await this.prisma.staff.count();
    const next = (count + 1).toString().padStart(4, '0');
    return `STF${next}`;
  }

  async create(data: {
    firstName: string;
    lastName: string;
    middleName?: string;
    gender?: string;
    phone?: string;
    email?: string;
    designation?: string;
    departmentId?: string;
    createLogin?: boolean;
    role?: Role;
  }) {
    if (!data.firstName || !data.lastName) {
      throw new BadRequestException('First name and last name are required');
    }

    let userId: string | undefined;
    let temporaryPassword: string | undefined;

    if (data.createLogin) {
      if (!data.email) {
        throw new BadRequestException('Email is required to create login');
      }

      const existing = await this.prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });
      if (existing) {
        throw new BadRequestException('Email already in use');
      }

      temporaryPassword = randomBytes(9).toString('base64url');
      const passwordHash = await bcrypt.hash(temporaryPassword, 10);

      const role = data.role || Role.TEACHER;

      const user = await this.prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role,
          isActive: true,
        },
      });

      userId = user.id;
    }

    const staffNumber = await this.generateStaffNumber();

    const staff = await this.prisma.staff.create({
      data: {
        userId,
        staffNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        gender: data.gender,
        phone: data.phone,
        email: data.email?.toLowerCase(),
        designation: data.designation || 'Teacher',
        departmentId: data.departmentId,
        status: EmploymentStatus.ACTIVE,
        employmentDate: new Date(),
      },
      include: {
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

    return {
      staff,
      login:
        data.createLogin && data.email
          ? {
              email: data.email.toLowerCase(),
              temporaryPassword,
              role: data.role || Role.TEACHER,
            }
          : null,
    };
  }
}