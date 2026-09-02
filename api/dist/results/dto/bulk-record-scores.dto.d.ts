declare class ScoreItemDto {
    studentId: string;
    score: number;
    remark?: string;
}
export declare class BulkRecordScoresDto {
    assessmentId: string;
    scores: ScoreItemDto[];
}
export {};
