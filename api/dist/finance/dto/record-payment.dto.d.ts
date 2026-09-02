import { PaymentMethod } from '@prisma/client';
export declare class RecordPaymentDto {
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    notes?: string;
    paystackRef?: string;
}
