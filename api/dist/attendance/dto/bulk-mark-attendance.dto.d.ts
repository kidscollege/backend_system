import { AttendanceStatus } from '@prisma/client';
declare class AttendanceItemDto {
    studentId: string;
    status: AttendanceStatus;
    remark?: string;
}
export declare class BulkMarkAttendanceDto {
    termId: string;
    date: string;
    records: AttendanceItemDto[];
}
export {};
