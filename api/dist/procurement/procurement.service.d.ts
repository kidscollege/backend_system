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
            totalAmount: Prisma.Decimal;
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
    createPurchaseRequest(dto: CreatePurchaseRequestDto, requestedById?: string): Promise<{
        items: {
            id: string;
            total: Prisma.Decimal;
            description: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        notes: string | null;
        totalAmount: Prisma.Decimal | null;
        requestNo: string;
        requestedById: string | null;
    }>;
    getPurchaseRequests(status?: PurchaseRequestStatus): Promise<({
        items: {
            id: string;
            total: Prisma.Decimal;
            description: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        notes: string | null;
        totalAmount: Prisma.Decimal | null;
        requestNo: string;
        requestedById: string | null;
    })[]>;
    getPurchaseRequest(id: string): Promise<{
        items: {
            id: string;
            total: Prisma.Decimal;
            description: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        notes: string | null;
        totalAmount: Prisma.Decimal | null;
        requestNo: string;
        requestedById: string | null;
    }>;
    updateRequestStatus(id: string, status: PurchaseRequestStatus): Promise<{
        items: {
            id: string;
            total: Prisma.Decimal;
            description: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
            purchaseRequestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PurchaseRequestStatus;
        notes: string | null;
        totalAmount: Prisma.Decimal | null;
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
    getInventoryItems(category?: string): Promise<{
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
    getLowStockItems(): Promise<{
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
}
