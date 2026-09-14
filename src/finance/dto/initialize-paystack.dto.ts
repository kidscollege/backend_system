import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InitializePaystackDto {
  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @IsEmail()
  email: string;
}