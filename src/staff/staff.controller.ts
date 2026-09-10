import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.HR_ADMIN)
  findAll() {
    return this.staffService.findAll();
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.HR_ADMIN)
  create(@Body() body: any) {
    return this.staffService.create(body);
  }
}