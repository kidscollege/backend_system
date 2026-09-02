import { IsString, IsNotEmpty, IsOptional, IsArray, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  amount: string; // we will convert to number/Decimal

  @IsOptional()
  @IsString()
  feeStructureId?: string;
}

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  termId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];
}