import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateGradingSchemeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsObject({ each: true })
  bands: Array<{
    minPercentage: number;
    grade: string;
    remark: string;
  }>;
}