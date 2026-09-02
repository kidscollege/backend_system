var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, } from '@nestjs/common';
import { ProcurementService } from './procurement.service.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto.js';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role, PurchaseRequestStatus } from '@prisma/client';
let ProcurementController = class ProcurementController {
    procurementService;
    constructor(procurementService) {
        this.procurementService = procurementService;
    }
    createSupplier(dto) {
        return this.procurementService.createSupplier(dto);
    }
    getSuppliers() {
        return this.procurementService.getSuppliers();
    }
    getSupplier(id) {
        return this.procurementService.getSupplier(id);
    }
    createRequest(dto, user) {
        return this.procurementService.createPurchaseRequest(dto, user.id);
    }
    getRequests(status) {
        return this.procurementService.getPurchaseRequests(status);
    }
    getRequest(id) {
        return this.procurementService.getPurchaseRequest(id);
    }
    updateRequestStatus(id, status) {
        return this.procurementService.updateRequestStatus(id, status);
    }
    createInventoryItem(dto) {
        return this.procurementService.createInventoryItem(dto);
    }
    getInventory(category) {
        return this.procurementService.getInventoryItems(category);
    }
    getLowStock() {
        return this.procurementService.getLowStockItems();
    }
    getInventoryItem(id) {
        return this.procurementService.getInventoryItem(id);
    }
    updateStock(id, quantity) {
        return this.procurementService.updateStock(id, quantity);
    }
};
__decorate([
    Post('suppliers'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PROCUREMENT),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSupplierDto]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createSupplier", null);
__decorate([
    Get('suppliers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "getSuppliers", null);
__decorate([
    Get('suppliers/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "getSupplier", null);
__decorate([
    Post('requests'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PROCUREMENT, Role.HR_ADMIN),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePurchaseRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createRequest", null);
__decorate([
    Get('requests'),
    __param(0, Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "getRequests", null);
__decorate([
    Get('requests/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "getRequest", null);
__decorate([
    Patch('requests/:id/status'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PROCUREMENT),
    __param(0, Param('id')),
    __param(1, Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "updateRequestStatus", null);
__decorate([
    Post('inventory'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PROCUREMENT),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateInventoryItemDto]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createInventoryItem", null);
__decorate([
    Get('inventory'),
    __param(0, Query('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "getInventory", null);
__decorate([
    Get('inventory/low-stock'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "getLowStock", null);
__decorate([
    Get('inventory/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "getInventoryItem", null);
__decorate([
    Patch('inventory/:id/stock'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PROCUREMENT),
    __param(0, Param('id')),
    __param(1, Body('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "updateStock", null);
ProcurementController = __decorate([
    Controller('procurement'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [ProcurementService])
], ProcurementController);
export { ProcurementController };
//# sourceMappingURL=procurement.controller.js.map