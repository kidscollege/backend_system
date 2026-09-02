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
import { Controller, Get, Post, Body, Param, Query, UseGuards, } from '@nestjs/common';
import { FinanceService } from './finance.service.js';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
let FinanceController = class FinanceController {
    financeService;
    constructor(financeService) {
        this.financeService = financeService;
    }
    createFeeStructure(dto) {
        return this.financeService.createFeeStructure(dto);
    }
    getFeeStructures() {
        return this.financeService.getFeeStructures();
    }
    createInvoice(dto) {
        return this.financeService.createInvoice(dto);
    }
    getInvoices(studentId) {
        return this.financeService.getInvoices(studentId);
    }
    getInvoice(id) {
        return this.financeService.getInvoice(id);
    }
    recordPayment(dto) {
        return this.financeService.recordPayment(dto);
    }
    getStudentBalance(studentId) {
        return this.financeService.getStudentBalances(studentId);
    }
};
__decorate([
    Post('fee-structures'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateFeeStructureDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createFeeStructure", null);
__decorate([
    Get('fee-structures'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getFeeStructures", null);
__decorate([
    Post('invoices'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateInvoiceDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createInvoice", null);
__decorate([
    Get('invoices'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR, Role.PRINCIPAL),
    __param(0, Query('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getInvoices", null);
__decorate([
    Get('invoices/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getInvoice", null);
__decorate([
    Post('payments'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecordPaymentDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "recordPayment", null);
__decorate([
    Get('students/:studentId/balance'),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getStudentBalance", null);
FinanceController = __decorate([
    Controller('finance'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [FinanceService])
], FinanceController);
export { FinanceController };
//# sourceMappingURL=finance.controller.js.map