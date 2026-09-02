import { StudentStatus } from '@prisma/client';
export declare class QueryStudentsDto {
    search?: string;
    status?: StudentStatus;
    classId?: string;
    page?: number;
    limit?: number;
}
