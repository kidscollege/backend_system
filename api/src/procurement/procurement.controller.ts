import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProcurementService } from './procurement.service.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto.js';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role, PurchaseRequestStatus } from '@prisma/client';

@Controller('procurement')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  // ===== SUPPLIERS =====
  @Post('suppliers')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PROCUREMENT)
  createSupplier(@Body() dto: CreateSupplierDto) {
    return this.procurementService.createSupplier(dto);
  }

  @Get('suppliers')
  getSuppliers() {
    return this.procurementService.getSuppliers();
  }

  @Get('suppliers/:id')
  getSupplier(@Param('id') id: string) {
    return this.procurementService.getSupplier(id);
  }

  // ===== PURCHASE REQUESTS =====
  @Post('requests')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PROCUREMENT, Role.HR_ADMIN)
  createRequest(
    @Body() dto: CreatePurchaseRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.procurementService.createPurchaseRequest(dto, user.id);
  }

  @Get('requests')
  getRequests(@Query('status') status?: PurchaseRequestStatus) {
    return this.procurementService.getPurchaseRequests(status);
  }

  @Get('requests/:id')
  getRequest(@Param('id') id: string) {
    return this.procurementService.getPurchaseRequest(id);
  }

  @Patch('requests/:id/status')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PROCUREMENT)
  updateRequestStatus(
    @Param('id') id: string,
    @Body('status') status: PurchaseRequestStatus,
  ) {
    return this.procurementService.updateRequestStatus(id, status);
  }

  // ===== INVENTORY =====
  @Post('inventory')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PROCUREMENT)
  createInventoryItem(@Body() dto: CreateInventoryItemDto) {
    return this.procurementService.createInventoryItem(dto);
  }

  @Get('inventory')
  getInventory(@Query('category') category?: string) {
    return this.procurementService.getInventoryItems(category);
  }

  @Get('inventory/low-stock')
  getLowStock() {
    return this.procurementService.getLowStockItems();
  }

  @Get('inventory/:id')
  getInventoryItem(@Param('id') id: string) {
    return this.procurementService.getInventoryItem(id);
  }

  @Patch('inventory/:id/stock')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PROCUREMENT)
  updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.procurementService.updateStock(id, quantity);
  }
}