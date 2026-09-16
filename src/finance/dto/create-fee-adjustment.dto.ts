import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { FeeAdjustmentType } from '@prisma/client';

export class CreateFeeAdjustmentDto {
  @IsEnum(FeeAdjustmentType)
  type: FeeAdjustmentType;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}