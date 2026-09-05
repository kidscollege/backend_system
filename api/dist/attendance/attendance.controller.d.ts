import { AttendanceService } from './attendance.service.js';
import { MarkAttendanceDto } from './dto/mark-attendance.dto.js';
import { BulkMarkAttendanceDto } from './dto/bulk-mark-attendance.dto.js';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    markAttendance(dto: MarkAttendanceDto, user: any): Promise<{
        student: {
            id: string;
            firstName: string;
            lastName: string;
            admissionNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        studentId: string;
        termId: string;
        remark: string | null;
        date: Date;
        markedById: string | null;
    }>;
    bulkMarkAttendance(dto: BulkMarkAttendanceDto, user: any): Promise<{
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
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.AttendanceStatus;
            studentId: string;
            termId: string;
            remark: string | null;
            date: Date;
            markedById: string | null;
        }[];
    }>;
    getClassAttendance(classId: string, date: string, termId: string): Promise<{
        classId: string;
        date: string;
        termId: string;
        attendance: {
            student: {
                id: string;
                firstName: string;
                lastName: string;
                admissionNumber: string;
            };
            status: import("@prisma/client").$Enums.AttendanceStatus | null;
            remark: string | null;
        }[];
    }>;
    getByDate(date: string, termId: string): Promise<({
        student: {
            id: string;
            firstName: string;
            lastName: string;
            admissionNumber: string;
            currentClass: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sessionId: string;
                campusId: string | null;
                level: string | null;
                capacity: number | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        studentId: string;
        termId: string;
        remark: string | null;
        date: Date;
        markedById: string | null;
    })[]>;
}
