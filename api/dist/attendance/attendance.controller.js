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
import { AttendanceService } from './attendance.service.js';
import { MarkAttendanceDto } from './dto/mark-attendance.dto.js';
import { BulkMarkAttendanceDto } from './dto/bulk-mark-attendance.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '@prisma/client';
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    markAttendance(dto, user) {
        return this.attendanceService.markAttendance(dto, user.id);
    }
    bulkMarkAttendance(dto, user) {
        return this.attendanceService.bulkMarkAttendance(dto, user.id);
    }
    getStudentAttendance(studentId, termId) {
        return this.attendanceService.getStudentAttendance(studentId, termId);
    }
    getClassAttendance(classId, date, termId) {
        return this.attendanceService.getClassAttendance(classId, date, termId);
    }
    getByDate(date, termId) {
        return this.attendanceService.getAttendanceByDate(date, termId);
    }
};
__decorate([
    Post(),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MarkAttendanceDto, Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "markAttendance", null);
__decorate([
    Post('bulk'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BulkMarkAttendanceDto, Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "bulkMarkAttendance", null);
__decorate([
    Get('students/:studentId'),
    __param(0, Param('studentId')),
    __param(1, Query('termId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getStudentAttendance", null);
__decorate([
    Get('classes/:classId'),
    __param(0, Param('classId')),
    __param(1, Query('date')),
    __param(2, Query('termId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getClassAttendance", null);
__decorate([
    Get('date'),
    __param(0, Query('date')),
    __param(1, Query('termId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getByDate", null);
AttendanceController = __decorate([
    Controller('attendance'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [AttendanceService])
], AttendanceController);
export { AttendanceController };
//# sourceMappingURL=attendance.controller.js.map