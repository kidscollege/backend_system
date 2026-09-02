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
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, } from '@nestjs/common';
import { HrService } from './hr.service.js';
import { CreateStaffDto } from './dto/create-staff.dto.js';
import { UpdateStaffDto } from './dto/update-staff.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role, EmploymentStatus } from '@prisma/client';
let HrController = class HrController {
    hrService;
    constructor(hrService) {
        this.hrService = hrService;
    }
    create(dto) {
        return this.hrService.create(dto);
    }
    findAll(search, status, departmentId) {
        return this.hrService.findAll(search, status, departmentId);
    }
    findOne(id) {
        return this.hrService.findOne(id);
    }
    update(id, dto) {
        return this.hrService.update(id, dto);
    }
    changeStatus(id, status) {
        return this.hrService.changeStatus(id, status);
    }
    remove(id) {
        return this.hrService.remove(id);
    }
};
__decorate([
    Post('staff'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.HR_ADMIN),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStaffDto]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "create", null);
__decorate([
    Get('staff'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.HR_ADMIN, Role.PRINCIPAL),
    __param(0, Query('search')),
    __param(1, Query('status')),
    __param(2, Query('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "findAll", null);
__decorate([
    Get('staff/:id'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.HR_ADMIN, Role.PRINCIPAL),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "findOne", null);
__decorate([
    Patch('staff/:id'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.HR_ADMIN),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStaffDto]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "update", null);
__decorate([
    Patch('staff/:id/status'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.HR_ADMIN),
    __param(0, Param('id')),
    __param(1, Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "changeStatus", null);
__decorate([
    Delete('staff/:id'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "remove", null);
HrController = __decorate([
    Controller('hr'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [HrService])
], HrController);
export { HrController };
//# sourceMappingURL=hr.controller.js.map