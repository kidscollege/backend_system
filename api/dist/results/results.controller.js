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
import { ResultsService } from './results.service.js';
import { CreateAssessmentDto } from './dto/create-assessment.dto.js';
import { RecordScoreDto } from './dto/record-score.dto.js';
import { BulkRecordScoresDto } from './dto/bulk-record-scores.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
let ResultsController = class ResultsController {
    resultsService;
    constructor(resultsService) {
        this.resultsService = resultsService;
    }
    createAssessment(dto) {
        return this.resultsService.createAssessment(dto);
    }
    getAssessments(termId, subjectId) {
        return this.resultsService.getAssessments(termId, subjectId);
    }
    getAssessment(id) {
        return this.resultsService.getAssessment(id);
    }
    recordScore(dto) {
        return this.resultsService.recordScore(dto);
    }
    bulkRecordScores(dto) {
        return this.resultsService.bulkRecordScores(dto);
    }
    getStudentResults(studentId, termId) {
        return this.resultsService.getStudentResults(studentId, termId);
    }
    getClassResults(classId, assessmentId) {
        return this.resultsService.getClassResults(classId, assessmentId);
    }
};
__decorate([
    Post('assessments'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAssessmentDto]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "createAssessment", null);
__decorate([
    Get('assessments'),
    __param(0, Query('termId')),
    __param(1, Query('subjectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "getAssessments", null);
__decorate([
    Get('assessments/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "getAssessment", null);
__decorate([
    Post('scores'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecordScoreDto]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "recordScore", null);
__decorate([
    Post('scores/bulk'),
    Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BulkRecordScoresDto]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "bulkRecordScores", null);
__decorate([
    Get('students/:studentId'),
    __param(0, Param('studentId')),
    __param(1, Query('termId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "getStudentResults", null);
__decorate([
    Get('classes/:classId/assessments/:assessmentId'),
    __param(0, Param('classId')),
    __param(1, Param('assessmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "getClassResults", null);
ResultsController = __decorate([
    Controller('results'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [ResultsService])
], ResultsController);
export { ResultsController };
//# sourceMappingURL=results.controller.js.map