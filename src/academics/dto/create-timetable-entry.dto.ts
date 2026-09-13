import { IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

export class CreateTimetableEntryDto {
  @IsString()
  sessionId: string;

  @IsOptional()
  @IsString()
  termId?: string;

  @IsString()
  classId: string;

  @IsOptional()
  @IsString()
  sectionId?: string;

  @IsString()
  subjectId: string;

  @IsString()
  teacherId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  dayOfWeek: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  endTime: string;

  @IsOptional()
  @IsString()
  room?: string;
}