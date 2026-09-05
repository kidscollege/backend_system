import { HrService } from './hr.service.js';
import { CreateStaffDto } from './dto/create-staff.dto.js';
import { UpdateStaffDto } from './dto/update-staff.dto.js';
import { EmploymentStatus } from '@prisma/client';
export declare class HrController {
    private readonly hrService;
    constructor(hrService: HrService);
    create(dto: CreateStaffDto): Promise<{
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            schoolId: string;
        } | null;
    } & {
        email: string | null;
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        address: string | null;
        status: import("@prisma/client").$Enums.EmploymentStatus;
        photoUrl: string | null;
        userId: string | null;
        departmentId: string | null;
        designation: string | null;
        employmentDate: Date | null;
        staffNumber: string;
    }>;
    findAll(search?: string, status?: EmploymentStatus, departmentId?: string): Promise<({
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            schoolId: string;
        } | null;
    } & {
        email: string | null;
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        address: string | null;
        status: import("@prisma/client").$Enums.EmploymentStatus;
        photoUrl: string | null;
        userId: string | null;
        departmentId: string | null;
        designation: string | null;
        employmentDate: Date | null;
        staffNumber: string;
    })[]>;
    findOne(id: string): Promise<{
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            schoolId: string;
        } | null;
        classSubjects: ({
            subject: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
                description: string | null;
                departmentId: string | null;
            };
            class: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sessionId: string;
                campusId: string | null;
                level: string | null;
                capacity: number | null;
            };
            section: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                classId: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
            subjectId: string;
            sectionId: string | null;
            teacherId: string | null;
        })[];
    } & {
        email: string | null;
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        address: string | null;
        status: import("@prisma/client").$Enums.EmploymentStatus;
        photoUrl: string | null;
        userId: string | null;
        departmentId: string | null;
        designation: string | null;
        employmentDate: Date | null;
        staffNumber: string;
    }>;
    update(id: string, dto: UpdateStaffDto): Promise<{
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            schoolId: string;
        } | null;
    } & {
        email: string | null;
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        address: string | null;
        status: import("@prisma/client").$Enums.EmploymentStatus;
        photoUrl: string | null;
        userId: string | null;
        departmentId: string | null;
        designation: string | null;
        employmentDate: Date | null;
        staffNumber: string;
    }>;
    changeStatus(id: string, status: EmploymentStatus): Promise<{
        email: string | null;
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        address: string | null;
        status: import("@prisma/client").$Enums.EmploymentStatus;
        photoUrl: string | null;
        userId: string | null;
        departmentId: string | null;
        designation: string | null;
        employmentDate: Date | null;
        staffNumber: string;
    }>;
    remove(id: string): Promise<{
        email: string | null;
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        address: string | null;
        status: import("@prisma/client").$Enums.EmploymentStatus;
        photoUrl: string | null;
        userId: string | null;
        departmentId: string | null;
        designation: string | null;
        employmentDate: Date | null;
        staffNumber: string;
    }>;
}
