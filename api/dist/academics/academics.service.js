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
let AcademicsService = class AcademicsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSession(dto) {
        const school = await this.prisma.school.findFirst();
        if (!school) {
            throw new BadRequestException('No school found. Please create a school first.');
        }
        if (dto.isCurrent) {
            await this.prisma.academicSession.updateMany({
                where: { isCurrent: true },
                data: { isCurrent: false },
            });
        }
        return this.prisma.academicSession.create({
            data: {
                schoolId: school.id,
                name: dto.name,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                isCurrent: dto.isCurrent ?? false,
            },
        });
    }
    async getSessions() {
        return this.prisma.academicSession.findMany({
            orderBy: { startDate: 'desc' },
            include: {
                terms: true,
                _count: { select: { classes: true, students: true } },
            },
        });
    }
    async getCurrentSession() {
        const session = await this.prisma.academicSession.findFirst({
            where: { isCurrent: true },
            include: { terms: true },
        });
        if (!session) {
            throw new NotFoundException('No current academic session found');
        }
        return session;
    }
    async createTerm(dto) {
        const session = await this.prisma.academicSession.findUnique({
            where: { id: dto.sessionId },
        });
        if (!session) {
            throw new NotFoundException('Academic session not found');
        }
        if (dto.isCurrent) {
            await this.prisma.term.updateMany({
                where: { sessionId: dto.sessionId, isCurrent: true },
                data: { isCurrent: false },
            });
        }
        return this.prisma.term.create({
            data: {
                sessionId: dto.sessionId,
                name: dto.name,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                isCurrent: dto.isCurrent ?? false,
            },
        });
    }
    async getTermsBySession(sessionId) {
        return this.prisma.term.findMany({
            where: { sessionId },
            orderBy: { startDate: 'asc' },
        });
    }
    async createDepartment(dto) {
        const school = await this.prisma.school.findFirst();
        if (!school) {
            throw new BadRequestException('No school found');
        }
        return this.prisma.department.create({
            data: {
                schoolId: school.id,
                name: dto.name,
                code: dto.code,
            },
        });
    }
    async getDepartments() {
        return this.prisma.department.findMany({
            include: {
                _count: { select: { subjects: true, staff: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async createSubject(dto) {
        return this.prisma.subject.create({
            data: {
                name: dto.name,
                code: dto.code,
                description: dto.description,
                departmentId: dto.departmentId,
                isActive: dto.isActive ?? true,
            },
        });
    }
    async getSubjects() {
        return this.prisma.subject.findMany({
            where: { isActive: true },
            include: { department: true },
            orderBy: { name: 'asc' },
        });
    }
    async createClass(dto) {
        const session = await this.prisma.academicSession.findUnique({
            where: { id: dto.sessionId },
        });
        if (!session) {
            throw new NotFoundException('Academic session not found');
        }
        return this.prisma.class.create({
            data: {
                sessionId: dto.sessionId,
                name: dto.name,
                level: dto.level,
                capacity: dto.capacity,
                campusId: dto.campusId,
            },
            include: {
                sections: true,
                session: true,
            },
        });
    }
    async getClasses(sessionId) {
        return this.prisma.class.findMany({
            where: sessionId ? { sessionId } : undefined,
            include: {
                sections: true,
                session: true,
                _count: { select: { students: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async createSection(dto) {
        const classExists = await this.prisma.class.findUnique({
            where: { id: dto.classId },
        });
        if (!classExists) {
            throw new NotFoundException('Class not found');
        }
        return this.prisma.classSection.create({
            data: {
                classId: dto.classId,
                name: dto.name,
            },
        });
    }
    async getSectionsByClass(classId) {
        return this.prisma.classSection.findMany({
            where: { classId },
            orderBy: { name: 'asc' },
        });
    }
    async updateSession(id, dto) {
        const session = await this.prisma.academicSession.findUnique({ where: { id } });
        if (!session)
            throw new NotFoundException('Session not found');
        if (dto.isCurrent) {
            await this.prisma.academicSession.updateMany({
                where: { isCurrent: true },
                data: { isCurrent: false },
            });
        }
        return this.prisma.academicSession.update({
            where: { id },
            data: {
                name: dto.name,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                isCurrent: dto.isCurrent ?? session.isCurrent,
            },
        });
    }
    async deleteSession(id) {
        const session = await this.prisma.academicSession.findUnique({ where: { id } });
        if (!session)
            throw new NotFoundException('Session not found');
        return this.prisma.academicSession.delete({ where: { id } });
    }
    async updateClass(id, dto) {
        const classExists = await this.prisma.class.findUnique({ where: { id } });
        if (!classExists)
            throw new NotFoundException('Class not found');
        return this.prisma.class.update({
            where: { id },
            data: {
                name: dto.name,
                level: dto.level,
                capacity: dto.capacity,
                sessionId: dto.sessionId,
                campusId: dto.campusId,
            },
            include: { session: true, sections: true },
        });
    }
    async deleteClass(id) {
        const classExists = await this.prisma.class.findUnique({ where: { id } });
        if (!classExists)
            throw new NotFoundException('Class not found');
        return this.prisma.class.delete({ where: { id } });
    }
    async updateSubject(id, dto) {
        const subject = await this.prisma.subject.findUnique({ where: { id } });
        if (!subject)
            throw new NotFoundException('Subject not found');
        return this.prisma.subject.update({
            where: { id },
            data: {
                name: dto.name,
                code: dto.code,
                description: dto.description,
                departmentId: dto.departmentId,
                isActive: dto.isActive ?? subject.isActive,
            },
        });
    }
    async deleteSubject(id) {
        const subject = await this.prisma.subject.findUnique({ where: { id } });
        if (!subject)
            throw new NotFoundException('Subject not found');
        return this.prisma.subject.delete({ where: { id } });
    }
};
AcademicsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AcademicsService);
export { AcademicsService };
//# sourceMappingURL=academics.service.js.map