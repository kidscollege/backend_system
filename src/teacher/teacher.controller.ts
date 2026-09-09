import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TeacherService } from './teacher.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '@prisma/client';

@Controller('teacher')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TEACHER)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser() user: any) {
    return this.teacherService.getDashboard(user.id);
  }

  @Get('assignments')
  getAssignments(@CurrentUser() user: any) {
    return this.teacherService.getAssignments(user.id);
  }

  @Get('terms')
  getTerms() {
    return this.teacherService.getTerms();
  }

  @Get('classes/:classId/students')
  getClassStudents(
    @CurrentUser() user: any,
    @Param('classId') classId: string,
    @Query('sectionId') sectionId?: string,
  ) {
    return this.teacherService.getClassStudents(user.id, classId, sectionId);
  }

  @Post('attendance')
  markAttendance(@CurrentUser() user: any, @Body() body: any) {
    return this.teacherService.markAttendance(user.id, body);
  }

  @Get('attendance')
getAttendanceByDate(
  @CurrentUser() user: any,
  @Query('classId') classId: string,
  @Query('date') date: string,
  @Query('sectionId') sectionId?: string,
) {
  return this.teacherService.getAttendanceByDate(
    user.id,
    classId,
    date,
    sectionId,
  );
}

@Get('assessments')
getAssessments(
  @CurrentUser() user: any,
  @Query('subjectId') subjectId: string,
  @Query('termId') termId: string,
) {
  return this.teacherService.getAssessments(user.id, subjectId, termId);
}

@Post('assessments')
createAssessment(@CurrentUser() user: any, @Body() body: any) {
  return this.teacherService.createAssessment(user.id, body);
}

@Get('assessments/:assessmentId/scores')
getAssessmentScores(
  @CurrentUser() user: any,
  @Param('assessmentId') assessmentId: string,
  @Query('classId') classId: string,
  @Query('sectionId') sectionId?: string,
) {
  return this.teacherService.getAssessmentScores(
    user.id,
    assessmentId,
    classId,
    sectionId,
  );
}

@Post('assessments/:assessmentId/scores')
saveAssessmentScores(
  @CurrentUser() user: any,
  @Param('assessmentId') assessmentId: string,
  @Body() body: any,
) {
  return this.teacherService.saveAssessmentScores(user.id, {
    assessmentId,
    classId: body.classId,
    sectionId: body.sectionId,
    scores: body.scores || [],
  });
}
}