import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ScoreItemDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  @Min(0)
  score: number;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class BulkRecordScoresDto {
  @IsString()
  @IsNotEmpty()
  assessmentId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoreItemDto)
  scores: ScoreItemDto[];
}