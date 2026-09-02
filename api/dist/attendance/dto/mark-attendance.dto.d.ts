import { AttendanceStatus } from '@prisma/client';
export declare class MarkAttendanceDto {
    studentId: string;
    termId: string;
    date: string;
    status: AttendanceStatus;
    remark?: string;
}
