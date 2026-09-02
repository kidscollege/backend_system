import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStaffDto } from './dto/create-staff.dto.js';
import { UpdateStaffDto } from './dto/update-staff.dto.js';
import { EmploymentStatus } from '@prisma/client';
export declare class HrService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateStaffNumber;
    create(dto: CreateStaffDto): Promise<{
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            schoolId: string;
            code: string | null;
        } | null;
    } & {
        id: string;
        staffNumber: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        phone: string | null;
        email: string | null;
        address: string | null;
        designation: string | null;
        employmentDate: Date | null;
        status: import("@prisma/client").$Enums.EmploymentStatus;
        photoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        departmentId: string | null;
    }>;
    findAll(search?: string, status?: EmploymentStatus, departmentId?: string): Promise<({
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            schoolId: string;
            code: string | null;
        } | null;
    } & {
        id: string;
        staffNumber: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        phone: string | null;
        email: string | null;
        address: string | null;
        designation: string | null;
        employmentDate: Date | null;
        status: import("@prisma/client").$Enums.EmploymentStatus;
        photoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        departmentId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            schoolId: string;
            code: string | null;
        } | null;
        classSubjects: ({
            class: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                campusId: string | null;
                sessionId: string;
                level: string | null;
                capacity: number | null;
            };
            subject: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                departmentId: string | null;
                name: string;
                code: string | null;
                description: string | null;
                isActive: boolean;
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
            sectionId: string | null;
            subjectId: string;
            teacherId: string | null;
        })[];
    } & {
        id: string;
        staffNumber: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        phone: string | null;
        email: string | null;
        address: string | null;
        designation: string | null;
        employmentDate: Date | null;
        status: import("@prisma/client").$Enums.EmploymentStatus;
        photoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        departmentId: string | null;
    }>;
    update(id: string, dto: UpdateStaffDto): Promise<{
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            schoolId: string;
            code: string | null;
        } | null;
    } & {
        id: string;
        staffNumber: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        phone: string | null;
        email: string | null;
        address: string | null;
        designation: string | null;
        employmentDate: Date | null;
        status: import("@prisma/client").$Enums.EmploymentStatus;
        photoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        departmentId: string | null;
    }>;
    changeStatus(id: string, status: EmploymentStatus): Promise<{
        id: string;
        staffNumber: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        phone: string | null;
        email: string | null;
        address: string | null;
        designation: string | null;
        employmentDate: Date | null;
        status: import("@prisma/client").$Enums.EmploymentStatus;
        photoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        departmentId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        staffNumber: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        phone: string | null;
        email: string | null;
        address: string | null;
        designation: string | null;
        employmentDate: Date | null;
        status: import("@prisma/client").$Enums.EmploymentStatus;
        photoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        departmentId: string | null;
    }>;
}
