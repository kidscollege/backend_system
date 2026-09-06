import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  termId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  name: string; // e.g. CA1, CA2, Exam, Mid-Term

  @IsNumber()
  @Min(1)
  maxScore: number;

  @IsOptional()
  @IsNumber()
  weight?: number; // percentage contribution (optional)

  @IsOptional()
  @IsDateString()
  assessmentDate?: string;
}