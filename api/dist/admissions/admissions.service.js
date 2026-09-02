var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ApplicationStatus, StudentStatus } from '@prisma/client';
let AdmissionsService = class AdmissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateApplicationNumber() {
        const year = new Date().getFullYear().toString().slice(-2);
        const count = await this.prisma.admissionApplication.count();
        const next = (count + 1).toString().padStart(4, '0');
        return `APP${year}${next}`;
    }
    async createApplication(dto) {
        const applicationNo = await this.generateApplicationNumber();
        return this.prisma.admissionApplication.create({
            data: {
                applicationNo,
                firstName: dto.firstName,
                lastName: dto.lastName,
                middleName: dto.middleName,
                gender: dto.gender,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
                applyingClass: dto.applyingClass,
                parentName: dto.parentName,
                parentPhone: dto.parentPhone,
                parentEmail: dto.parentEmail,
                notes: dto.notes,
                status: ApplicationStatus.SUBMITTED,
            },
        });
    }
    async findAll(status) {
        return this.prisma.admissionApplication.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const application = await this.prisma.admissionApplication.findUnique({
            where: { id },
            include: {
                student: true,
            },
        });
        if (!application) {
            throw new NotFoundException('Application not found');
        }
        return application;
    }
    async reviewApplication(id, dto, reviewedById) {
        const application = await this.findOne(id);
        if (application.status === ApplicationStatus.ADMITTED ||
            application.status === ApplicationStatus.REJECTED) {
            throw new BadRequestException(`Application is already ${application.status}`);
        }
        return this.prisma.admissionApplication.update({
            where: { id },
            data: {
                status: dto.status,
                notes: dto.notes ?? application.notes,
                reviewedById,
                reviewedAt: new Date(),
            },
        });
    }
    async admitApplication(id, reviewedById) {
        const application = await this.findOne(id);
        if (application.status === ApplicationStatus.ADMITTED) {
            throw new BadRequestException('Application is already admitted');
        }
        if (application.status === ApplicationStatus.REJECTED) {
            throw new BadRequestException('Cannot admit a rejected application');
        }
        const year = new Date().getFullYear().toString().slice(-2);
        const count = await this.prisma.student.count();
        const next = (count + 1).toString().padStart(4, '0');
        const admissionNumber = `ADM${year}${next}`;
        const result = await this.prisma.$transaction(async (tx) => {
            const student = await tx.student.create({
                data: {
                    admissionNumber,
                    firstName: application.firstName,
                    lastName: application.lastName,
                    middleName: application.middleName,
                    gender: application.gender,
                    dateOfBirth: application.dateOfBirth,
                    status: StudentStatus.ACTIVE,
                    admissionDate: new Date(),
                },
            });
            if (application.parentName) {
                const nameParts = application.parentName.trim().split(' ');
                const parentFirstName = nameParts[0] || 'Parent';
                const parentLastName = nameParts.slice(1).join(' ') || 'Guardian';
                const parent = await tx.parent.create({
                    data: {
                        firstName: parentFirstName,
                        lastName: parentLastName,
                        phone: application.parentPhone,
                        email: application.parentEmail,
                    },
                });
                await tx.studentGuardian.create({
                    data: {
                        studentId: student.id,
                        parentId: parent.id,
                        relationship: 'Guardian',
                        isPrimary: true,
                    },
                });
            }
            const updatedApplication = await tx.admissionApplication.update({
                where: { id },
                data: {
                    status: ApplicationStatus.ADMITTED,
                    studentId: student.id,
                    reviewedById,
                    reviewedAt: new Date(),
                },
                include: {
                    student: true,
                },
            });
            return updatedApplication;
        });
        return result;
    }
    async getStats() {
        const [total, submitted, underReview, approved, rejected, admitted] = await Promise.all([
            this.prisma.admissionApplication.count(),
            this.prisma.admissionApplication.count({
                where: { status: ApplicationStatus.SUBMITTED },
            }),
            this.prisma.admissionApplication.count({
                where: { status: ApplicationStatus.UNDER_REVIEW },
            }),
            this.prisma.admissionApplication.count({
                where: { status: ApplicationStatus.APPROVED },
            }),
            this.prisma.admissionApplication.count({
                where: { status: ApplicationStatus.REJECTED },
            }),
            this.prisma.admissionApplication.count({
                where: { status: ApplicationStatus.ADMITTED },
            }),
        ]);
        return {
            total,
            submitted,
            underReview,
            approved,
            rejected,
            admitted,
        };
    }
};
AdmissionsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AdmissionsService);
export { AdmissionsService };
//# sourceMappingURL=admissions.service.js.map