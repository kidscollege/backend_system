import { IsDateString, IsInt, IsString, Max, Min } from 'class-validator';

export class CreatePaymentPlanDto {
  @IsString()
  invoiceId: string;

  @IsInt()
  @Min(2)
  @Max(24)
  installmentCount: number;

  @IsDateString()
  firstDueDate: string;
}