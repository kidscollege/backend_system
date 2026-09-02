import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  name: string; // e.g. JSS 1, SS 2

  @IsOptional()
  @IsString()
  level?: string; // Junior / Senior

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsString()
  campusId?: string;
}