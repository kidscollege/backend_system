import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto.js';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto.js';
import { PurchaseRequestStatus, Prisma } from '@prisma/client';
export declare class ProcurementService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateRequestNo;
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
            totalAmount: Prisma.Decimal;
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
    createPurchaseRequest(dto: CreatePurchaseRequestDto, requestedById?: string): Promise<{
        items: {
            id: string;
            description: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
            total: Prisma.Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        totalAmount: Prisma.Decimal | null;
        requestNo: string;
        requestedById: string | null;
        notes: string | null;
    }>;
    getPurchaseRequests(status?: PurchaseRequestStatus): Promise<({
        items: {
            id: string;
            description: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
            total: Prisma.Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        totalAmount: Prisma.Decimal | null;
        requestNo: string;
        requestedById: string | null;
        notes: string | null;
    })[]>;
    getPurchaseRequest(id: string): Promise<{
        items: {
            id: string;
            description: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
            total: Prisma.Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        totalAmount: Prisma.Decimal | null;
        requestNo: string;
        requestedById: string | null;
        notes: string | null;
    }>;
    updateRequestStatus(id: string, status: PurchaseRequestStatus): Promise<{
        items: {
            id: string;
            description: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
            total: Prisma.Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        totalAmount: Prisma.Decimal | null;
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
    getInventoryItems(category?: string): Promise<{
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
    getLowStockItems(): Promise<{
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
}
