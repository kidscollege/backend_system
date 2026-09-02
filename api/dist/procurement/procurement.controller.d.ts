import { ProcurementService } from './procurement.service.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto.js';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto.js';
import { PurchaseRequestStatus } from '@prisma/client';
export declare class ProcurementController {
    private readonly procurementService;
    constructor(procurementService: ProcurementService);
    createSupplier(dto: CreateSupplierDto): Promise<{
        id: string;
        name: string;
        contactPerson: string | null;
        phone: string | null;
        email: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getSuppliers(): Promise<{
        id: string;
        name: string;
        contactPerson: string | null;
        phone: string | null;
        email: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getSupplier(id: string): Promise<{
        purchaseOrders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderNo: string;
            supplierId: string | null;
            status: string;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            orderedAt: Date | null;
        }[];
    } & {
        id: string;
        name: string;
        contactPerson: string | null;
        phone: string | null;
        email: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createRequest(dto: CreatePurchaseRequestDto, user: any): Promise<{
        items: {
            id: string;
            description: string;
            quantity: number;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal | null;
        requestNo: string;
        requestedById: string | null;
        notes: string | null;
    }>;
    getRequests(status?: PurchaseRequestStatus): Promise<({
        items: {
            id: string;
            description: string;
            quantity: number;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal | null;
        requestNo: string;
        requestedById: string | null;
        notes: string | null;
    })[]>;
    getRequest(id: string): Promise<{
        items: {
            id: string;
            description: string;
            quantity: number;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal | null;
        requestNo: string;
        requestedById: string | null;
        notes: string | null;
    }>;
    updateRequestStatus(id: string, status: PurchaseRequestStatus): Promise<{
        items: {
            id: string;
            description: string;
            quantity: number;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal | null;
        requestNo: string;
        requestedById: string | null;
        notes: string | null;
    }>;
    createInventoryItem(dto: CreateInventoryItemDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        sku: string | null;
        category: string | null;
        unit: string | null;
        minStock: number | null;
        location: string | null;
    }>;
    getInventory(category?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        sku: string | null;
        category: string | null;
        unit: string | null;
        minStock: number | null;
        location: string | null;
    }[]>;
    getLowStock(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        sku: string | null;
        category: string | null;
        unit: string | null;
        minStock: number | null;
        location: string | null;
    }[]>;
    getInventoryItem(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        sku: string | null;
        category: string | null;
        unit: string | null;
        minStock: number | null;
        location: string | null;
    }>;
    updateStock(id: string, quantity: number): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        sku: string | null;
        category: string | null;
        unit: string | null;
        minStock: number | null;
        location: string | null;
    }>;
}
