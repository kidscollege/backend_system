import { IsString, IsNotEmpty, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  name: string; // e.g. "2025/2026"

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;
}