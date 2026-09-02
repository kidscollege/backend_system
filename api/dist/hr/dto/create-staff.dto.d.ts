import { EmploymentStatus } from '@prisma/client';
export declare class CreateStaffDto {
    firstName: string;
    lastName: string;
    middleName?: string;
    gender?: string;
    dateOfBirth?: string;
    phone?: string;
    email?: string;
    address?: string;
    departmentId?: string;
    designation?: string;
    employmentDate?: string;
    status?: EmploymentStatus;
}
