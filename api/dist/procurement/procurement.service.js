var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PurchaseRequestStatus, Prisma } from '@prisma/client';
let ProcurementService = class ProcurementService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateRequestNo() {
        const year = new Date().getFullYear().toString().slice(-2);
        const count = await this.prisma.purchaseRequest.count();
        const next = (count + 1).toString().padStart(4, '0');
        return `PR${year}${next}`;
    }
    async createSupplier(dto) {
        return this.prisma.supplier.create({
            data: {
                name: dto.name,
                contactPerson: dto.contactPerson,
                phone: dto.phone,
                email: dto.email,
                address: dto.address,
            },
        });
    }
    async getSuppliers() {
        return this.prisma.supplier.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async getSupplier(id) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { id },
            include: { purchaseOrders: true },
        });
        if (!supplier)
            throw new NotFoundException('Supplier not found');
        return supplier;
    }
    async createPurchaseRequest(dto, requestedById) {
        if (!dto.items || dto.items.length === 0) {
            throw new BadRequestException('Purchase request must have at least one item');
        }
        const requestNo = await this.generateRequestNo();
        const totalAmount = dto.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        return this.prisma.purchaseRequest.create({
            data: {
                requestNo,
                requestedById,
                status: PurchaseRequestStatus.DRAFT,
                totalAmount: new Prisma.Decimal(totalAmount),
                notes: dto.notes,
                items: {
                    create: dto.items.map((item) => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: new Prisma.Decimal(item.unitPrice),
                        total: new Prisma.Decimal(item.quantity * item.unitPrice),
                    })),
                },
            },
            include: {
                items: true,
            },
        });
    }
    async getPurchaseRequests(status) {
        return this.prisma.purchaseRequest.findMany({
            where: status ? { status } : undefined,
            include: {
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getPurchaseRequest(id) {
        const request = await this.prisma.purchaseRequest.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!request)
            throw new NotFoundException('Purchase request not found');
        return request;
    }
    async updateRequestStatus(id, status) {
        await this.getPurchaseRequest(id);
        return this.prisma.purchaseRequest.update({
            where: { id },
            data: { status },
            include: { items: true },
        });
    }
    async createInventoryItem(dto) {
        return this.prisma.inventoryItem.create({
            data: {
                name: dto.name,
                sku: dto.sku,
                category: dto.category,
                quantity: dto.quantity ?? 0,
                unit: dto.unit,
                minStock: dto.minStock,
                location: dto.location,
            },
        });
    }
    async getInventoryItems(category) {
        return this.prisma.inventoryItem.findMany({
            where: category ? { category } : undefined,
            orderBy: { name: 'asc' },
        });
    }
    async getInventoryItem(id) {
        const item = await this.prisma.inventoryItem.findUnique({
            where: { id },
        });
        if (!item)
            throw new NotFoundException('Inventory item not found');
        return item;
    }
    async updateStock(id, quantity) {
        const item = await this.getInventoryItem(id);
        return this.prisma.inventoryItem.update({
            where: { id },
            data: {
                quantity: item.quantity + quantity,
            },
        });
    }
    async getLowStockItems() {
        const items = await this.prisma.inventoryItem.findMany({
            where: {
                minStock: { not: null },
            },
        });
        return items.filter((item) => item.minStock !== null && item.quantity <= item.minStock);
    }
};
ProcurementService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ProcurementService);
export { ProcurementService };
//# sourceMappingURL=procurement.service.js.map