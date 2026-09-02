import { IsString, IsNotEmpty, IsArray, ValidateNested, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '@prisma/client';

class AttendanceItemDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class BulkMarkAttendanceDto {
  @IsString()
  @IsNotEmpty()
  termId: string;

  @IsDateString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceItemDto)
  records: AttendanceItemDto[];
}