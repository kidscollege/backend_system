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
import { AcademicsService } from './academics.service.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { CreateTermDto } from './dto/create-term.dto.js';
import { CreateDepartmentDto } from './dto/create-department.dto.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { CreateSectionDto } from './dto/create-section.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
let AcademicsController = class AcademicsController {
    academicsService;
    constructor(academicsService) {
        this.academicsService = academicsService;
    }
    createSession(dto) {
        return this.academicsService.createSession(dto);
    }
    getSessions() {
        return this.academicsService.getSessions();
    }
    getCurrentSession() {
        return this.academicsService.getCurrentSession();
    }
    createTerm(dto) {
        return this.academicsService.createTerm(dto);
    }
    getTerms(sessionId) {
        return this.academicsService.getTermsBySession(sessionId);
    }
    createDepartment(dto) {
        return this.academicsService.createDepartment(dto);
    }
    getDepartments() {
        return this.academicsService.getDepartments();
    }
    createSubject(dto) {
        return this.academicsService.createSubject(dto);
    }
    getSubjects() {
        return this.academicsService.getSubjects();
    }
    createClass(dto) {
        return this.academicsService.createClass(dto);
    }
    getClasses(sessionId) {
        return this.academicsService.getClasses(sessionId);
    }
    createSection(dto) {
        return this.academicsService.createSection(dto);
    }
    getSections(classId) {
        return this.academicsService.getSectionsByClass(classId);
    }
};
__decorate([
    Post('sessions'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSessionDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createSession", null);
__decorate([
    Get('sessions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getSessions", null);
__decorate([
    Get('sessions/current'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getCurrentSession", null);
__decorate([
    Post('terms'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTermDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createTerm", null);
__decorate([
    Get('sessions/:sessionId/terms'),
    __param(0, Param('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getTerms", null);
__decorate([
    Post('departments'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateDepartmentDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createDepartment", null);
__decorate([
    Get('departments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getDepartments", null);
__decorate([
    Post('subjects'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSubjectDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createSubject", null);
__decorate([
    Get('subjects'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getSubjects", null);
__decorate([
    Post('classes'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateClassDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createClass", null);
__decorate([
    Get('classes'),
    __param(0, Query('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getClasses", null);
__decorate([
    Post('sections'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSectionDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createSection", null);
__decorate([
    Get('classes/:classId/sections'),
    __param(0, Param('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getSections", null);
AcademicsController = __decorate([
    Controller('academics'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [AcademicsService])
], AcademicsController);
export { AcademicsController };
//# sourceMappingURL=academics.controller.js.map