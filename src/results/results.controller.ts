import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResultsService } from './results.service.js';
import { CreateAssessmentDto } from './dto/create-assessment.dto.js';
import { UpdateAssessmentDto } from './dto/update-assessment.dto.js';
import { RecordScoreDto } from './dto/record-score.dto.js';
import { BulkRecordScoresDto } from './dto/bulk-record-scores.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '@prisma/client';

@Controller('results')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  // Assessments
  @Post('assessments')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  createAssessment(
    @CurrentUser() user: any,
    @Body() dto: CreateAssessmentDto,
  ) {
    return this.resultsService.createAssessment(dto, user);
  }

  @Get('assessments')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  getAssessments(
    @CurrentUser() user: any,
    @Query('termId') termId?: string,
    @Query('subjectId') subjectId?: string,
  ) {
    return this.resultsService.getAssessments(termId, subjectId, user);
  }

  @Get('assessments/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  getAssessment(@CurrentUser() user: any, @Param('id') id: string) {
    return this.resultsService.getAssessment(id, user);
  }

  @Patch('assessments/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  updateAssessment(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateAssessmentDto,
  ) {
    return this.resultsService.updateAssessment(id, dto, user);
  }

  @Delete('assessments/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  deleteAssessment(@CurrentUser() user: any, @Param('id') id: string) {
    return this.resultsService.deleteAssessment(id, user);
  }

  // Scores
  @Post('scores')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  recordScore(@CurrentUser() user: any, @Body() dto: RecordScoreDto) {
    return this.resultsService.recordScore(dto, user);
  }

  @Post('scores/bulk')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  bulkRecordScores(@CurrentUser() user: any, @Body() dto: BulkRecordScoresDto) {
    return this.resultsService.bulkRecordScores(dto, user);
  }

  // Student Results
  @Get('students/:studentId')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  getStudentResults(
    @CurrentUser() user: any,
    @Param('studentId') studentId: string,
    @Query('termId') termId?: string,
  ) {
    return this.resultsService.getStudentResults(studentId, termId, user);
  }

  // Class Results for one assessment
  @Get('classes/:classId/assessments/:assessmentId')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  getClassResults(
    @CurrentUser() user: any,
    @Param('classId') classId: string,
    @Param('assessmentId') assessmentId: string,
  ) {
    return this.resultsService.getClassResults(classId, assessmentId, user);
  }
}