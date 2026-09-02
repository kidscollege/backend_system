import { ResultsService } from './results.service.js';
import { CreateAssessmentDto } from './dto/create-assessment.dto.js';
import { RecordScoreDto } from './dto/record-score.dto.js';
import { BulkRecordScoresDto } from './dto/bulk-record-scores.dto.js';
export declare class ResultsController {
    private readonly resultsService;
    constructor(resultsService: ResultsService);
    createAssessment(dto: CreateAssessmentDto): Promise<{
        term: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
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
        maxScore: number;
        weight: number | null;
        assessmentDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        termId: string;
        subjectId: string;
    }>;
    getAssessments(termId?: string, subjectId?: string): Promise<({
        term: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
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
        maxScore: number;
        weight: number | null;
        assessmentDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        termId: string;
        subjectId: string;
    })[]>;
    getAssessment(id: string): Promise<{
        term: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            startDate: Date;
            endDate: Date;
            isCurrent: boolean;
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
        scores: ({
            student: {
                id: string;
                admissionNumber: string;
                firstName: string;
                lastName: string;
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
        name: string;
        maxScore: number;
        weight: number | null;
        assessmentDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        termId: string;
        subjectId: string;
    }>;
    recordScore(dto: RecordScoreDto): Promise<{
        assessment: {
            id: string;
            name: string;
            maxScore: number;
            weight: number | null;
            assessmentDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    sessionId: string;
                    startDate: Date;
                    endDate: Date;
                    isCurrent: boolean;
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
                maxScore: number;
                weight: number | null;
                assessmentDate: Date | null;
                createdAt: Date;
                updatedAt: Date;
                termId: string;
                subjectId: string;
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
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sessionId: string;
                startDate: Date;
                endDate: Date;
                isCurrent: boolean;
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
            maxScore: number;
            weight: number | null;
            assessmentDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
