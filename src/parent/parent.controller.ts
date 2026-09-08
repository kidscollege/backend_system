import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ParentService } from './parent.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '@prisma/client';

@Controller('parent')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PARENT)
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser() user: any) {
    return this.parentService.getDashboard(user.id);
  }

  @Get('children')
  getChildren(@CurrentUser() user: any) {
    return this.parentService.getChildren(user.id);
  }

  @Get('children/:studentId/attendance')
  getAttendance(
    @CurrentUser() user: any,
    @Param('studentId') studentId: string,
  ) {
    return this.parentService.getChildAttendance(user.id, studentId);
  }

  @Get('children/:studentId/results')
  getResults(
    @CurrentUser() user: any,
    @Param('studentId') studentId: string,
  ) {
    return this.parentService.getChildResults(user.id, studentId);
  }

  @Get('children/:studentId/invoices')
  getInvoices(
    @CurrentUser() user: any,
    @Param('studentId') studentId: string,
  ) {
    return this.parentService.getChildInvoices(user.id, studentId);
  }
}