import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service.js';
import { MarkAttendanceDto } from './dto/mark-attendance.dto.js';
import { BulkMarkAttendanceDto } from './dto/bulk-mark-attendance.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '@prisma/client';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  markAttendance(
    @Body() dto: MarkAttendanceDto,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.markAttendance(dto, user.id);
  }

  @Post('bulk')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.TEACHER)
  bulkMarkAttendance(
    @Body() dto: BulkMarkAttendanceDto,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.bulkMarkAttendance(dto, user.id);
  }

  @Get('students/:studentId')
  getStudentAttendance(
    @Param('studentId') studentId: string,
    @Query('termId') termId?: string,
  ) {
    return this.attendanceService.getStudentAttendance(studentId, termId);
  }

  @Get('classes/:classId')
  getClassAttendance(
    @Param('classId') classId: string,
    @Query('date') date: string,
    @Query('termId') termId: string,
  ) {
    return this.attendanceService.getClassAttendance(classId, date, termId);
  }

  @Get('date')
  getByDate(
    @Query('date') date: string,
    @Query('termId') termId: string,
  ) {
    return this.attendanceService.getAttendanceByDate(date, termId);
  }
}