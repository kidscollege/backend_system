import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateFeeStructureDto {
  @IsString()
  @IsNotEmpty()
  name: string; // e.g. Tuition Fee, Development Levy

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  classId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  termId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}