import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAssessmentDto } from './dto/create-assessment.dto.js';
import { RecordScoreDto } from './dto/record-score.dto.js';
import { BulkRecordScoresDto } from './dto/bulk-record-scores.dto.js';
export declare class ResultsService {
    private prisma;
    constructor(prisma: PrismaService);
    createAssessment(dto: CreateAssessmentDto): Promise<{
        term: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sessionId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
        };
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        termId: string;
        subjectId: string;
        maxScore: number;
        weight: number | null;
        assessmentDate: Date | null;
    }>;
    getAssessments(termId?: string, subjectId?: string): Promise<({
        term: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sessionId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
        };
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
        _count: {
            scores: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        termId: string;
        subjectId: string;
        maxScore: number;
        weight: number | null;
        assessmentDate: Date | null;
    })[]>;
    getAssessment(id: string): Promise<{
        term: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sessionId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
        };
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
        scores: ({
            student: {
                id: string;
                firstName: string;
                lastName: string;
                admissionNumber: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            assessmentId: string;
            score: number | null;
            remark: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        termId: string;
        subjectId: string;
        maxScore: number;
        weight: number | null;
        assessmentDate: Date | null;
    }>;
    recordScore(dto: RecordScoreDto): Promise<{
        student: {
            id: string;
            firstName: string;
            lastName: string;
            admissionNumber: string;
        };
        assessment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            termId: string;
            subjectId: string;
            maxScore: number;
            weight: number | null;
            assessmentDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        assessmentId: string;
        score: number | null;
        remark: string | null;
    }>;
    bulkRecordScores(dto: BulkRecordScoresDto): Promise<{
        message: string;
        count: number;
    }>;
    getStudentResults(studentId: string, termId?: string): Promise<{
        student: {
            id: string;
            admissionNumber: string;
            firstName: string;
            lastName: string;
        };
        scores: ({
            assessment: {
                term: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    sessionId: string;
                    startDate: Date;
                    endDate: Date;
                    isCurrent: boolean;
                };
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
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                termId: string;
                subjectId: string;
                maxScore: number;
                weight: number | null;
                assessmentDate: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            assessmentId: string;
            score: number | null;
            remark: string | null;
        })[];
    }>;
    getClassResults(classId: string, assessmentId: string): Promise<{
        assessment: {
            term: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sessionId: string;
                startDate: Date;
                endDate: Date;
                isCurrent: boolean;
            };
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
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            termId: string;
            subjectId: string;
            maxScore: number;
            weight: number | null;
            assessmentDate: Date | null;
        };
        results: {
            student: {
                id: string;
                firstName: string;
                lastName: string;
                admissionNumber: string;
            };
            score: number | null;
            remark: string | null;
        }[];
    }>;
}
