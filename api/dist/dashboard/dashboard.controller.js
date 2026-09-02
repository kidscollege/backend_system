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
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getOverview() {
        return this.dashboardService.getOverview();
    }
    getFinanceSummary() {
        return this.dashboardService.getFinanceSummary();
    }
    getStudentSummary() {
        return this.dashboardService.getStudentSummary();
    }
    getAttendanceSummary(termId, days) {
        return this.dashboardService.getAttendanceSummary(termId, days ? parseInt(days) : 7);
    }
    getRecentActivities() {
        return this.dashboardService.getRecentActivities();
    }
};
__decorate([
    Get('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getOverview", null);
__decorate([
    Get('finance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getFinanceSummary", null);
__decorate([
    Get('students'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getStudentSummary", null);
__decorate([
    Get('attendance'),
    __param(0, Query('termId')),
    __param(1, Query('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getAttendanceSummary", null);
__decorate([
    Get('recent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getRecentActivities", null);
DashboardController = __decorate([
    Controller('dashboard'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.BURSAR),
    __metadata("design:paramtypes", [DashboardService])
], DashboardController);
export { DashboardController };
//# sourceMappingURL=dashboard.controller.js.map