import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStaffDto } from './dto/create-staff.dto.js';
import { UpdateStaffDto } from './dto/update-staff.dto.js';
import { EmploymentStatus, Prisma } from '@prisma/client';

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
    const staffNumber = await this.generateStaffNumber();

    return this.prisma.staff.create({
      data: {
        staffNumber,
        firstName: dto.firstName,
        lastName: dto.lastName,
        middleName: dto.middleName,
        gender: dto.gender,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        phone: dto.phone,
        email: dto.email,
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
      },
    });
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