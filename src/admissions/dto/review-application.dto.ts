import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

export class ReviewApplicationDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus; // APPROVED, REJECTED, UNDER_REVIEW, ADMITTED

  @IsOptional()
  @IsString()
  notes?: string;
}