import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class MarkAttendanceDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  termId: string;

  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus; // PRESENT, ABSENT, LATE, EXCUSED

  @IsOptional()
  @IsString()
  remark?: string;
}