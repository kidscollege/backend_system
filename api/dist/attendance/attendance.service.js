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
import { AttendanceStatus } from '@prisma/client';
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async markAttendance(dto, markedById) {
        const student = await this.prisma.student.findUnique({
            where: { id: dto.studentId },
        });
        if (!student)
            throw new NotFoundException('Student not found');
        const term = await this.prisma.term.findUnique({
            where: { id: dto.termId },
        });
        if (!term)
            throw new NotFoundException('Term not found');
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
    async bulkMarkAttendance(dto, markedById) {
        const term = await this.prisma.term.findUnique({
            where: { id: dto.termId },
        });
        if (!term)
            throw new NotFoundException('Term not found');
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
    async getStudentAttendance(studentId, termId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
        });
        if (!student)
            throw new NotFoundException('Student not found');
        const records = await this.prisma.attendanceRecord.findMany({
            where: {
                studentId,
                ...(termId && { termId }),
            },
            orderBy: { date: 'desc' },
        });
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
    async getClassAttendance(classId, date, termId) {
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
    async getAttendanceByDate(date, termId) {
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
};
AttendanceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AttendanceService);
export { AttendanceService };
//# sourceMappingURL=attendance.service.js.map