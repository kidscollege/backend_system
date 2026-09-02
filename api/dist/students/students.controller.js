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
import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { QueryStudentsDto } from './dto/query-students.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role, StudentStatus } from '@prisma/client';
let StudentsController = class StudentsController {
    studentsService;
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    create(createStudentDto) {
        return this.studentsService.create(createStudentDto);
    }
    findAll(query) {
        return this.studentsService.findAll(query);
    }
    findOne(id) {
        return this.studentsService.findOne(id);
    }
    update(id, updateStudentDto) {
        return this.studentsService.update(id, updateStudentDto);
    }
    changeStatus(id, status) {
        return this.studentsService.changeStatus(id, status);
    }
    remove(id) {
        return this.studentsService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.HR_ADMIN),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER, Role.HR_ADMIN),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QueryStudentsDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER, Role.HR_ADMIN, Role.PARENT),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.HR_ADMIN),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "update", null);
__decorate([
    Patch(':id/status'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL),
    __param(0, Param('id')),
    __param(1, Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "changeStatus", null);
__decorate([
    Delete(':id'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "remove", null);
StudentsController = __decorate([
    Controller('students'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [StudentsService])
], StudentsController);
export { StudentsController };
//# sourceMappingURL=students.controller.js.map