declare class InvoiceItemDto {
    description: string;
    amount: string;
    feeStructureId?: string;
}
export declare class CreateInvoiceDto {
    studentId: string;
    sessionId?: string;
    termId?: string;
    dueDate?: string;
    items: InvoiceItemDto[];
}
export {};
