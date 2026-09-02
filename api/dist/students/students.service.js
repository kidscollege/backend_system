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
import { StudentStatus } from '@prisma/client';
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateAdmissionNumber() {
        const year = new Date().getFullYear().toString().slice(-2);
        const count = await this.prisma.student.count();
        const nextNumber = (count + 1).toString().padStart(4, '0');
        return `ADM${year}${nextNumber}`;
    }
    async create(dto) {
        const admissionNumber = await this.generateAdmissionNumber();
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
    async findAll(query) {
        const { search, status, classId, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const where = {};
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
    async findOne(id) {
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
    async update(id, dto) {
        await this.findOne(id);
        const data = { ...dto };
        if (dto.dateOfBirth) {
            data.dateOfBirth = new Date(dto.dateOfBirth);
        }
        if (dto.admissionDate) {
            data.admissionDate = new Date(dto.admissionDate);
        }
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
    async changeStatus(id, status) {
        await this.findOne(id);
        return this.prisma.student.update({
            where: { id },
            data: { status },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.student.update({
            where: { id },
            data: { status: StudentStatus.WITHDRAWN },
        });
    }
};
StudentsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], StudentsService);
export { StudentsService };
//# sourceMappingURL=students.service.js.map