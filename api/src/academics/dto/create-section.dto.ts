import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  name: string; // A, B, C...
}