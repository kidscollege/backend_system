import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class RecordPaymentDto {
  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod; // CASH, BANK_TRANSFER, PAYSTACK, OTHER

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  paystackRef?: string;
}