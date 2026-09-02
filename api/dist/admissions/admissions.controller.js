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
var _a, _b;
import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, } from '@nestjs/common';
import { AdmissionsService } from './admissions.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { ReviewApplicationDto } from './dto/review-application.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role, ApplicationStatus } from '@prisma/client';
let AdmissionsController = class AdmissionsController {
    admissionsService;
    constructor(admissionsService) {
        this.admissionsService = admissionsService;
    }
    createApplication(dto) {
        return this.admissionsService.createApplication(dto);
    }
    findAll(status) {
        return this.admissionsService.findAll(status);
    }
    findOne(id) {
        return this.admissionsService.findOne(id);
    }
    review(id, dto, user) {
        return this.admissionsService.reviewApplication(id, dto, user.id);
    }
    admit(id, user) {
        return this.admissionsService.admitApplication(id, user.id);
    }
    getStats() {
        return this.admissionsService.getStats();
    }
};
__decorate([
    Post('applications'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateApplicationDto]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "createApplication", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Get('applications'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.HR_ADMIN),
    __param(0, Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "findAll", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Get('applications/:id'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.HR_ADMIN),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "findOne", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Patch('applications/:id/review'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof ReviewApplicationDto !== "undefined" && ReviewApplicationDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "review", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Post('applications/:id/admit'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "admit", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Get('stats'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "getStats", null);
AdmissionsController = __decorate([
    Controller('admissions'),
    __metadata("design:paramtypes", [typeof (_a = typeof AdmissionsService !== "undefined" && AdmissionsService) === "function" ? _a : Object])
], AdmissionsController);
export { AdmissionsController };
//# sourceMappingURL=admissions.controller.js.map