import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { CreateTermDto } from './dto/create-term.dto.js';
import { CreateDepartmentDto } from './dto/create-department.dto.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { CreateSectionDto } from './dto/create-section.dto.js';
export declare class AcademicsService {
    private prisma;
    constructor(prisma: PrismaService);
    createSession(dto: CreateSessionDto): Promise<{
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
        createdAt: Date;
        updatedAt: Date;
        schoolId: string;
    }>;
    getSessions(): Promise<({
        terms: {
            id: string;
            name: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
        }[];
        _count: {
            classes: number;
            students: number;
        };
    } & {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
        createdAt: Date;
        updatedAt: Date;
        schoolId: string;
    })[]>;
    getCurrentSession(): Promise<{
        terms: {
            id: string;
            name: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
        }[];
    } & {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
        createdAt: Date;
        updatedAt: Date;
        schoolId: string;
    }>;
    createTerm(dto: CreateTermDto): Promise<{
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
    }>;
    getTermsBySession(sessionId: string): Promise<{
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
    }[]>;
    createDepartment(dto: CreateDepartmentDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        schoolId: string;
        code: string | null;
    }>;
    getDepartments(): Promise<({
        _count: {
            subjects: number;
            staff: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        schoolId: string;
        code: string | null;
    })[]>;
    createSubject(dto: CreateSubjectDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        description: string | null;
        isActive: boolean;
        departmentId: string | null;
    }>;
    getSubjects(): Promise<({
        department: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            schoolId: string;
            code: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        description: string | null;
        isActive: boolean;
        departmentId: string | null;
    })[]>;
    createClass(dto: CreateClassDto): Promise<{
        session: {
            id: string;
            name: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
            createdAt: Date;
            updatedAt: Date;
            schoolId: string;
        };
        sections: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
        level: string | null;
        capacity: number | null;
        campusId: string | null;
    }>;
    getClasses(sessionId?: string): Promise<({
        _count: {
            students: number;
        };
        session: {
            id: string;
            name: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
            createdAt: Date;
            updatedAt: Date;
            schoolId: string;
        };
        sections: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
        level: string | null;
        capacity: number | null;
        campusId: string | null;
    })[]>;
    createSection(dto: CreateSectionDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
    }>;
    getSectionsByClass(classId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
    }[]>;
}
