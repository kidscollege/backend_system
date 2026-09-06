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
        createdAt: Date;
        updatedAt: Date;
        name: string;
        schoolId: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
    }>;
    getSessions(): Promise<({
        _count: {
            students: number;
            classes: number;
        };
        terms: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sessionId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        schoolId: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
    })[]>;
    getCurrentSession(): Promise<{
        terms: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sessionId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        schoolId: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
    }>;
    createTerm(dto: CreateTermDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sessionId: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
    }>;
    getTermsBySession(sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sessionId: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
    }[]>;
    createDepartment(dto: CreateDepartmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        schoolId: string;
        code: string | null;
    }>;
    getDepartments(): Promise<({
        _count: {
            staff: number;
            subjects: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        schoolId: string;
        code: string | null;
    })[]>;
    createSubject(dto: CreateSubjectDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        description: string | null;
        departmentId: string | null;
    }>;
    getSubjects(): Promise<({
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        description: string | null;
        departmentId: string | null;
    })[]>;
    createClass(dto: CreateClassDto): Promise<{
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            schoolId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
        };
        sections: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            classId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sessionId: string;
        campusId: string | null;
        level: string | null;
        capacity: number | null;
    }>;
    getClasses(sessionId?: string): Promise<({
        _count: {
            students: number;
        };
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            schoolId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
        };
        sections: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            classId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sessionId: string;
        campusId: string | null;
        level: string | null;
        capacity: number | null;
    })[]>;
    createSection(dto: CreateSectionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        classId: string;
    }>;
    getSectionsByClass(classId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        classId: string;
    }[]>;
    updateSession(id: string, dto: CreateSessionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        schoolId: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
    }>;
    deleteSession(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        schoolId: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
    }>;
    updateClass(id: string, dto: CreateClassDto): Promise<{
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            schoolId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
        };
        sections: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            classId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sessionId: string;
        campusId: string | null;
        level: string | null;
        capacity: number | null;
    }>;
    deleteClass(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sessionId: string;
        campusId: string | null;
        level: string | null;
        capacity: number | null;
    }>;
    updateSubject(id: string, dto: CreateSubjectDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        description: string | null;
        departmentId: string | null;
    }>;
    deleteSubject(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string | null;
        description: string | null;
        departmentId: string | null;
    }>;
}
