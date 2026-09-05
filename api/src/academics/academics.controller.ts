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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('academics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

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

  @Get('sessions/:sessionId/terms')
  getTerms(@Param('sessionId') sessionId: string) {
    return this.academicsService.getTermsBySession(sessionId);
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