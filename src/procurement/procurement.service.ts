import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto.js';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto.js';
import { PurchaseRequestStatus, Prisma } from '@prisma/client';

@Injectable()
export class ProcurementService {
  constructor(private prisma: PrismaService) {}

  private async generateRequestNo(): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await this.prisma.purchaseRequest.count();
    const next = (count + 1).toString().padStart(4, '0');
    return `PR${year}${next}`;
  }

  // ======================
  // SUPPLIERS
  // ======================

  async createSupplier(dto: CreateSupplierDto) {
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

  async getSupplier(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: { purchaseOrders: true },
    });

    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  // ======================
  // PURCHASE REQUESTS
  // ======================

  async createPurchaseRequest(dto: CreatePurchaseRequestDto, requestedById?: string) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Purchase request must have at least one item');
    }

    const requestNo = await this.generateRequestNo();

    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

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

  async getPurchaseRequests(status?: PurchaseRequestStatus) {
    return this.prisma.purchaseRequest.findMany({
      where: status ? { status } : undefined,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPurchaseRequest(id: string) {
    const request = await this.prisma.purchaseRequest.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!request) throw new NotFoundException('Purchase request not found');
    return request;
  }

  async updateRequestStatus(id: string, status: PurchaseRequestStatus) {
    await this.getPurchaseRequest(id);

    return this.prisma.purchaseRequest.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }

  // ======================
  // INVENTORY
  // ======================

  async createInventoryItem(dto: CreateInventoryItemDto) {
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

  async getInventoryItems(category?: string) {
    return this.prisma.inventoryItem.findMany({
      where: category ? { category } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async getInventoryItem(id: string) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!item) throw new NotFoundException('Inventory item not found');
    return item;
  }

  async updateStock(id: string, quantity: number) {
    const item = await this.getInventoryItem(id);

    return this.prisma.inventoryItem.update({
      where: { id },
      data: {
        quantity: item.quantity + quantity, // positive = add, negative = remove
      },
    });
  }

  async getLowStockItems() {
    // Items where quantity <= minStock
    const items = await this.prisma.inventoryItem.findMany({
      where: {
        minStock: { not: null },
      },
    });

    return items.filter(
      (item) => item.minStock !== null && item.quantity <= item.minStock,
    );
  }
}