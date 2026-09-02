declare class PurchaseItemDto {
    description: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreatePurchaseRequestDto {
    notes?: string;
    items: PurchaseItemDto[];
}
export {};
