import { AcademicsService } from './academics.service.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { CreateTermDto } from './dto/create-term.dto.js';
import { CreateDepartmentDto } from './dto/create-department.dto.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { CreateSectionDto } from './dto/create-section.dto.js';
export declare class AcademicsController {
    private readonly academicsService;
    constructor(academicsService: AcademicsService);
    createSession(dto: CreateSessionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
        schoolId: string;
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
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
        schoolId: string;
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
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
        schoolId: string;
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
    getTerms(sessionId: string): Promise<{
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
        code: string | null;
        schoolId: string;
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
        code: string | null;
        schoolId: string;
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
            code: string | null;
            schoolId: string;
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
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
            schoolId: string;
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
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
            schoolId: string;
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
    getSections(classId: string): Promise<{
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
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
        schoolId: string;
    }>;
    deleteSession(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        startDate: Date;
        endDate: Date;
        isCurrent: boolean;
        schoolId: string;
    }>;
    updateClass(id: string, dto: CreateClassDto): Promise<{
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
            schoolId: string;
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
