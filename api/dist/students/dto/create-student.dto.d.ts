import { StudentStatus } from '@prisma/client';
export declare class CreateStudentDto {
    firstName: string;
    lastName: string;
    middleName?: string;
    gender?: string;
    dateOfBirth?: string;
    bloodGroup?: string;
    nationality?: string;
    religion?: string;
    address?: string;
    status?: StudentStatus;
    admissionDate?: string;
    currentClassId?: string;
    currentSectionId?: string;
    sessionId?: string;
    parentFirstName?: string;
    parentLastName?: string;
    parentPhone?: string;
    parentEmail?: string;
    relationship?: string;
}
