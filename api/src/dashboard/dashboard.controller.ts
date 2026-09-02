import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.BURSAR)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('finance')
  getFinanceSummary() {
    return this.dashboardService.getFinanceSummary();
  }

  @Get('students')
  getStudentSummary() {
    return this.dashboardService.getStudentSummary();
  }

  @Get('attendance')
  getAttendanceSummary(
    @Query('termId') termId: string,
    @Query('days') days?: string,
  ) {
    return this.dashboardService.getAttendanceSummary(
      termId,
      days ? parseInt(days) : 7,
    );
  }

  @Get('recent')
  getRecentActivities() {
    return this.dashboardService.getRecentActivities();
  }
}