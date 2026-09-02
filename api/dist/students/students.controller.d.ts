import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { QueryStudentsDto } from './dto/query-students.dto.js';
import { StudentStatus } from '@prisma/client';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto): Promise<{
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
        currentSection: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            classId: string;
        } | null;
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            schoolId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
        } | null;
        guardians: ({
            parent: {
                email: string | null;
                id: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                userId: string | null;
                occupation: string | null;
            };
        } & {
            id: string;
            relationship: string;
            studentId: string;
            parentId: string;
            isPrimary: boolean;
        })[];
        documents: {
            id: string;
            name: string;
            studentId: string;
            type: string;
            fileUrl: string;
            uploadedAt: Date;
        }[];
    } & {
        id: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        bloodGroup: string | null;
        nationality: string | null;
        religion: string | null;
        address: string | null;
        status: import("@prisma/client").$Enums.StudentStatus;
        admissionDate: Date | null;
        currentClassId: string | null;
        currentSectionId: string | null;
        sessionId: string | null;
        admissionNumber: string;
        photoUrl: string | null;
        userId: string | null;
    }>;
    findAll(query: QueryStudentsDto): Promise<{
        data: ({
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
            currentSection: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                classId: string;
            } | null;
            guardians: ({
                parent: {
                    email: string | null;
                    id: string;
                    firstName: string;
                    lastName: string;
                    phone: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    address: string | null;
                    userId: string | null;
                    occupation: string | null;
                };
            } & {
                id: string;
                relationship: string;
                studentId: string;
                parentId: string;
                isPrimary: boolean;
            })[];
        } & {
            id: string;
            firstName: string;
            lastName: string;
            createdAt: Date;
            updatedAt: Date;
            middleName: string | null;
            gender: string | null;
            dateOfBirth: Date | null;
            bloodGroup: string | null;
            nationality: string | null;
            religion: string | null;
            address: string | null;
            status: import("@prisma/client").$Enums.StudentStatus;
            admissionDate: Date | null;
            currentClassId: string | null;
            currentSectionId: string | null;
            sessionId: string | null;
            admissionNumber: string;
            photoUrl: string | null;
            userId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
        currentSection: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            classId: string;
        } | null;
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            schoolId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
        } | null;
        guardians: ({
            parent: {
                email: string | null;
                id: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                userId: string | null;
                occupation: string | null;
            };
        } & {
            id: string;
            relationship: string;
            studentId: string;
            parentId: string;
            isPrimary: boolean;
        })[];
        documents: {
            id: string;
            name: string;
            studentId: string;
            type: string;
            fileUrl: string;
            uploadedAt: Date;
        }[];
    } & {
        id: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        bloodGroup: string | null;
        nationality: string | null;
        religion: string | null;
        address: string | null;
        status: import("@prisma/client").$Enums.StudentStatus;
        admissionDate: Date | null;
        currentClassId: string | null;
        currentSectionId: string | null;
        sessionId: string | null;
        admissionNumber: string;
        photoUrl: string | null;
        userId: string | null;
    }>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<{
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
        currentSection: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            classId: string;
        } | null;
        guardians: ({
            parent: {
                email: string | null;
                id: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                userId: string | null;
                occupation: string | null;
            };
        } & {
            id: string;
            relationship: string;
            studentId: string;
            parentId: string;
            isPrimary: boolean;
        })[];
    } & {
        id: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        bloodGroup: string | null;
        nationality: string | null;
        religion: string | null;
        address: string | null;
        status: import("@prisma/client").$Enums.StudentStatus;
        admissionDate: Date | null;
        currentClassId: string | null;
        currentSectionId: string | null;
        sessionId: string | null;
        admissionNumber: string;
        photoUrl: string | null;
        userId: string | null;
    }>;
    changeStatus(id: string, status: StudentStatus): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        bloodGroup: string | null;
        nationality: string | null;
        religion: string | null;
        address: string | null;
        status: import("@prisma/client").$Enums.StudentStatus;
        admissionDate: Date | null;
        currentClassId: string | null;
        currentSectionId: string | null;
        sessionId: string | null;
        admissionNumber: string;
        photoUrl: string | null;
        userId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        middleName: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        bloodGroup: string | null;
        nationality: string | null;
        religion: string | null;
        address: string | null;
        status: import("@prisma/client").$Enums.StudentStatus;
        admissionDate: Date | null;
        currentClassId: string | null;
        currentSectionId: string | null;
        sessionId: string | null;
        admissionNumber: string;
        photoUrl: string | null;
        userId: string | null;
    }>;
}
