import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class UpdateAssessmentDto {
  @IsOptional()
  @IsString()
  termId?: string;

  @IsOptional()
  @IsString()
  subjectId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxScore?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsDateString()
  assessmentDate?: string;
}
