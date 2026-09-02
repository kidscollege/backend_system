import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResultsService } from './results.service.js';
import { CreateAssessmentDto } from './dto/create-assessment.dto.js';
import { RecordScoreDto } from './dto/record-score.dto.js';
import { BulkRecordScoresDto } from './dto/bulk-record-scores.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('results')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  // Assessments
  @Post('assessments')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  createAssessment(@Body() dto: CreateAssessmentDto) {
    return this.resultsService.createAssessment(dto);
  }

  @Get('assessments')
  getAssessments(
    @Query('termId') termId?: string,
    @Query('subjectId') subjectId?: string,
  ) {
    return this.resultsService.getAssessments(termId, subjectId);
  }

  @Get('assessments/:id')
  getAssessment(@Param('id') id: string) {
    return this.resultsService.getAssessment(id);
  }

  // Scores
  @Post('scores')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  recordScore(@Body() dto: RecordScoreDto) {
    return this.resultsService.recordScore(dto);
  }

  @Post('scores/bulk')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  bulkRecordScores(@Body() dto: BulkRecordScoresDto) {
    return this.resultsService.bulkRecordScores(dto);
  }

  // Student Results
  @Get('students/:studentId')
  getStudentResults(
    @Param('studentId') studentId: string,
    @Query('termId') termId?: string,
  ) {
    return this.resultsService.getStudentResults(studentId, termId);
  }

  // Class Results for one assessment
  @Get('classes/:classId/assessments/:assessmentId')
  getClassResults(
    @Param('classId') classId: string,
    @Param('assessmentId') assessmentId: string,
  ) {
    return this.resultsService.getClassResults(classId, assessmentId);
  }
}