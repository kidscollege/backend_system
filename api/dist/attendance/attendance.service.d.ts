import { PrismaService } from '../prisma/prisma.service.js';
import { MarkAttendanceDto } from './dto/mark-attendance.dto.js';
import { BulkMarkAttendanceDto } from './dto/bulk-mark-attendance.dto.js';
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    markAttendance(dto: MarkAttendanceDto, markedById?: string): Promise<{
        student: {
            id: string;
            admissionNumber: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        studentId: string;
        termId: string;
        date: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        remark: string | null;
        markedById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    bulkMarkAttendance(dto: BulkMarkAttendanceDto, markedById?: string): Promise<{
        message: string;
        count: number;
        date: string;
    }>;
    getStudentAttendance(studentId: string, termId?: string): Promise<{
        student: {
            id: string;
            admissionNumber: string;
            firstName: string;
            lastName: string;
        };
        summary: {
            present: number;
            absent: number;
            late: number;
            excused: number;
            total: number;
        };
        records: {
            id: string;
            studentId: string;
            termId: string;
            date: Date;
            status: import("@prisma/client").$Enums.AttendanceStatus;
            remark: string | null;
            markedById: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    getClassAttendance(classId: string, date: string, termId: string): Promise<{
        classId: string;
        date: string;
        termId: string;
        attendance: {
            student: {
                id: string;
                admissionNumber: string;
                firstName: string;
                lastName: string;
            };
            status: import("@prisma/client").$Enums.AttendanceStatus | null;
            remark: string | null;
        }[];
    }>;
    getAttendanceByDate(date: string, termId: string): Promise<({
        student: {
            id: string;
            admissionNumber: string;
            firstName: string;
            lastName: string;
            currentClass: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sessionId: string;
                name: string;
                campusId: string | null;
                level: string | null;
                capacity: number | null;
            } | null;
        };
    } & {
        id: string;
        studentId: string;
        termId: string;
        date: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        remark: string | null;
        markedById: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
