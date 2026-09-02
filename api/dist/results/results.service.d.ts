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
            sessionId: string;
            name: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        subject: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            code: string | null;
            description: string | null;
            isActive: boolean;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        maxScore: number;
        weight: number | null;
        assessmentDate: Date | null;
        termId: string;
        subjectId: string;
    }>;
    getAssessments(termId?: string, subjectId?: string): Promise<({
        term: {
            id: string;
            sessionId: string;
            name: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        subject: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            code: string | null;
            description: string | null;
            isActive: boolean;
        };
        _count: {
            scores: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        maxScore: number;
        weight: number | null;
        assessmentDate: Date | null;
        termId: string;
        subjectId: string;
    })[]>;
    getAssessment(id: string): Promise<{
        scores: ({
            student: {
                id: string;
                admissionNumber: string;
                firstName: string;
                lastName: string;
            };
        } & {
            studentId: string;
            score: number | null;
            remark: string | null;
            assessmentId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
        term: {
            id: string;
            sessionId: string;
            name: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        subject: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            code: string | null;
            description: string | null;
            isActive: boolean;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        maxScore: number;
        weight: number | null;
        assessmentDate: Date | null;
        termId: string;
        subjectId: string;
    }>;
    recordScore(dto: RecordScoreDto): Promise<{
        assessment: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            maxScore: number;
            weight: number | null;
            assessmentDate: Date | null;
            termId: string;
            subjectId: string;
        };
        student: {
            id: string;
            admissionNumber: string;
            firstName: string;
            lastName: string;
        };
    } & {
        studentId: string;
        score: number | null;
        remark: string | null;
        assessmentId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
                    sessionId: string;
                    name: string;
                    startDate: Date;
                    endDate: Date;
                    isCurrent: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
                subject: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    departmentId: string | null;
                    code: string | null;
                    description: string | null;
                    isActive: boolean;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                maxScore: number;
                weight: number | null;
                assessmentDate: Date | null;
                termId: string;
                subjectId: string;
            };
        } & {
            studentId: string;
            score: number | null;
            remark: string | null;
            assessmentId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    getClassResults(classId: string, assessmentId: string): Promise<{
        assessment: {
            term: {
                id: string;
                sessionId: string;
                name: string;
                startDate: Date;
                endDate: Date;
                isCurrent: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            subject: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                departmentId: string | null;
                code: string | null;
                description: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            maxScore: number;
            weight: number | null;
            assessmentDate: Date | null;
            termId: string;
            subjectId: string;
        };
        results: {
            student: {
                id: string;
                admissionNumber: string;
                firstName: string;
                lastName: string;
            };
            score: number | null;
            remark: string | null;
        }[];
    }>;
}
