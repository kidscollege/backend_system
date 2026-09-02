import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { QueryStudentsDto } from './dto/query-students.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role, StudentStatus } from '@prisma/client';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.HR_ADMIN)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @Roles(
    Role.SUPER_ADMIN,
    Role.MANAGEMENT,
    Role.PRINCIPAL,
    Role.TEACHER,
    Role.HR_ADMIN,
  )
  findAll(@Query() query: QueryStudentsDto) {
    return this.studentsService.findAll(query);
  }

  @Get(':id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.MANAGEMENT,
    Role.PRINCIPAL,
    Role.TEACHER,
    Role.HR_ADMIN,
    Role.PARENT,
  )
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.HR_ADMIN)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Patch(':id/status')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  changeStatus(
    @Param('id') id: string,
    @Body('status') status: StudentStatus,
  ) {
    return this.studentsService.changeStatus(id, status);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}