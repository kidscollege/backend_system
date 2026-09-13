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
import { AcademicsService } from './academics.service.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { CreateTermDto } from './dto/create-term.dto.js';
import { CreateDepartmentDto } from './dto/create-department.dto.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { CreateSectionDto } from './dto/create-section.dto.js';
import { CreateTimetableEntryDto } from './dto/create-timetable-entry.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('academics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @Get('timetable')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  getTimetable(
    @Query('sessionId') sessionId?: string,
    @Query('termId') termId?: string,
    @Query('classId') classId?: string,
    @Query('teacherId') teacherId?: string,
  ) {
    return this.academicsService.getTimetable({ sessionId, termId, classId, teacherId });
  }

  @Post('timetable')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  createTimetableEntry(@Body() dto: CreateTimetableEntryDto) {
    return this.academicsService.createTimetableEntry(dto);
  }

  @Patch('timetable/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  updateTimetableEntry(@Param('id') id: string, @Body() dto: CreateTimetableEntryDto) {
    return this.academicsService.updateTimetableEntry(id, dto);
  }

  @Delete('timetable/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  deleteTimetableEntry(@Param('id') id: string) {
    return this.academicsService.deleteTimetableEntry(id);
  }

  @Patch('timetable/:id/publish')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  setTimetablePublished(
    @Param('id') id: string,
    @Body('isPublished') isPublished: boolean,
  ) {
    return this.academicsService.setTimetablePublished(id, isPublished);
  }

  // ===== SESSIONS =====
  @Post('sessions')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  createSession(@Body() dto: CreateSessionDto) {
    return this.academicsService.createSession(dto);
  }

  @Get('sessions')
  getSessions() {
    return this.academicsService.getSessions();
  }

  @Get('sessions/current')
  getCurrentSession() {
    return this.academicsService.getCurrentSession();
  }

   // ===== TERMS =====
  @Post('terms')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  createTerm(@Body() dto: CreateTermDto) {
    return this.academicsService.createTerm(dto);
  }

  @Get('terms')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  getAllTerms(@Query('sessionId') sessionId?: string) {
    return this.academicsService.getTerms(sessionId);
  }

  @Get('sessions/:sessionId/terms')
  getTermsBySession(@Param('sessionId') sessionId: string) {
    return this.academicsService.getTermsBySession(sessionId);
  }

  @Get('class-subjects')
@Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.HR_ADMIN)
getClassSubjects(@Query('classId') classId?: string) {
  return this.academicsService.getClassSubjects(classId);
}

@Post('class-subjects')
@Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.HR_ADMIN)
assignTeacher(@Body() body: any) {
  return this.academicsService.assignTeacher(body);
}

  // ===== DEPARTMENTS =====
  @Post('departments')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.academicsService.createDepartment(dto);
  }

  @Get('departments')
  getDepartments() {
    return this.academicsService.getDepartments();
  }

  // ===== SUBJECTS =====
  @Post('subjects')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  createSubject(@Body() dto: CreateSubjectDto) {
    return this.academicsService.createSubject(dto);
  }

  @Get('subjects')
  getSubjects() {
    return this.academicsService.getSubjects();
  }

  // ===== CLASSES =====
  @Post('classes')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  createClass(@Body() dto: CreateClassDto) {
    return this.academicsService.createClass(dto);
  }

  @Get('classes')
  getClasses(@Query('sessionId') sessionId?: string) {
    return this.academicsService.getClasses(sessionId);
  }

  // ===== SECTIONS =====
  @Post('sections')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  createSection(@Body() dto: CreateSectionDto) {
    return this.academicsService.createSection(dto);
  }

  @Get('classes/:classId/sections')
  getSections(@Param('classId') classId: string) {
    return this.academicsService.getSectionsByClass(classId);
  }
    // ===== UPDATE / DELETE =====

  @Patch('sessions/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  updateSession(@Param('id') id: string, @Body() dto: CreateSessionDto) {
    return this.academicsService.updateSession(id, dto);
  }

  @Delete('sessions/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT)
  deleteSession(@Param('id') id: string) {
    return this.academicsService.deleteSession(id);
  }

  @Patch('classes/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  updateClass(@Param('id') id: string, @Body() dto: CreateClassDto) {
    return this.academicsService.updateClass(id, dto);
  }

  @Delete('classes/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT)
  deleteClass(@Param('id') id: string) {
    return this.academicsService.deleteClass(id);
  }

  @Patch('subjects/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  updateSubject(@Param('id') id: string, @Body() dto: CreateSubjectDto) {
    return this.academicsService.updateSubject(id, dto);
  }

  @Delete('subjects/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT)
  deleteSubject(@Param('id') id: string) {
    return this.academicsService.deleteSubject(id);
  }
}