var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EmploymentStatus } from '@prisma/client';
let HrService = class HrService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateStaffNumber() {
        const year = new Date().getFullYear().toString().slice(-2);
        const count = await this.prisma.staff.count();
        const next = (count + 1).toString().padStart(4, '0');
        return `STF${year}${next}`;
    }
    async create(dto) {
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
    async findAll(search, status, departmentId) {
        const where = {};
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
    async findOne(id) {
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
    async update(id, dto) {
        await this.findOne(id);
        const data = { ...dto };
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
    async changeStatus(id, status) {
        await this.findOne(id);
        return this.prisma.staff.update({
            where: { id },
            data: { status },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.staff.update({
            where: { id },
            data: { status: EmploymentStatus.TERMINATED },
        });
    }
};
HrService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], HrService);
export { HrService };
//# sourceMappingURL=hr.service.js.map