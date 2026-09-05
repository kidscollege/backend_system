import { ProcurementService } from './procurement.service.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto.js';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto.js';
import { PurchaseRequestStatus } from '@prisma/client';
export declare class ProcurementController {
    private readonly procurementService;
    constructor(procurementService: ProcurementService);
    createSupplier(dto: CreateSupplierDto): Promise<{
        email: string | null;
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string | null;
        contactPerson: string | null;
    }>;
    getSuppliers(): Promise<{
        email: string | null;
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string | null;
        contactPerson: string | null;
    }[]>;
    getSupplier(id: string): Promise<{
        purchaseOrders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            orderNo: string;
            supplierId: string | null;
            orderedAt: Date | null;
        }[];
    } & {
        email: string | null;
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string | null;
        contactPerson: string | null;
    }>;
    createRequest(dto: CreatePurchaseRequestDto, user: any): Promise<{
        items: {
            id: string;
            total: import("@prisma/client-runtime-utils").Decimal;
            description: string;
            quantity: number;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        notes: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal | null;
        requestNo: string;
        requestedById: string | null;
    }>;
    getRequests(status?: PurchaseRequestStatus): Promise<({
        items: {
            id: string;
            total: import("@prisma/client-runtime-utils").Decimal;
            description: string;
            quantity: number;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        notes: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal | null;
        requestNo: string;
        requestedById: string | null;
    })[]>;
    getRequest(id: string): Promise<{
        items: {
            id: string;
            total: import("@prisma/client-runtime-utils").Decimal;
            description: string;
            quantity: number;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        notes: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal | null;
        requestNo: string;
        requestedById: string | null;
    }>;
    updateRequestStatus(id: string, status: PurchaseRequestStatus): Promise<{
        items: {
            id: string;
            total: import("@prisma/client-runtime-utils").Decimal;
            description: string;
            quantity: number;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        notes: string | null;
        totalAmount: import("@prisma/client-runtime-utils").Decimal | null;
        requestNo: string;
        requestedById: string | null;
    }>;
    createInventoryItem(dto: CreateInventoryItemDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        quantity: number;
        sku: string | null;
        category: string | null;
        unit: string | null;
        minStock: number | null;
        location: string | null;
    }>;
    getInventory(category?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        quantity: number;
        sku: string | null;
        category: string | null;
        unit: string | null;
        minStock: number | null;
        location: string | null;
    }[]>;
    getLowStock(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        quantity: number;
        sku: string | null;
        category: string | null;
        unit: string | null;
        minStock: number | null;
        location: string | null;
    }[]>;
    getInventoryItem(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        quantity: number;
        sku: string | null;
        category: string | null;
        unit: string | null;
        minStock: number | null;
        location: string | null;
    }>;
    updateStock(id: string, quantity: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        quantity: number;
        sku: string | null;
        category: string | null;
        unit: string | null;
        minStock: number | null;
        location: string | null;
    }>;
}
