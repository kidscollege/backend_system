import { IsArray, IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFeePlanDto {
  @IsString()
  studentId: string;

  @IsString()
  sessionId: string;

  @IsOptional()
  @IsString()
  termId?: string;

  @IsArray()
  @IsString({ each: true })
  feeStructureIds: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}