import { ApplicationStatus } from '@prisma/client';
export declare class ReviewApplicationDto {
    status: ApplicationStatus;
    notes?: string;
}
