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
import { HrService } from './hr.service.js';
import { CreateStaffDto } from './dto/create-staff.dto.js';
import { UpdateStaffDto } from './dto/update-staff.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role, EmploymentStatus } from '@prisma/client';

@Controller('hr')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Post('staff')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.HR_ADMIN)
  create(@Body() dto: CreateStaffDto) {
    return this.hrService.create(dto);
  }

  @Get('staff')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.HR_ADMIN, Role.PRINCIPAL)
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: EmploymentStatus,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.hrService.findAll(search, status, departmentId);
  }

  @Get('staff/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.HR_ADMIN, Role.PRINCIPAL)
  findOne(@Param('id') id: string) {
    return this.hrService.findOne(id);
  }

  @Patch('staff/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.HR_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.hrService.update(id, dto);
  }

  @Patch('staff/:id/status')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.HR_ADMIN)
  changeStatus(
    @Param('id') id: string,
    @Body('status') status: EmploymentStatus,
  ) {
    return this.hrService.changeStatus(id, status);
  }

  @Delete('staff/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT)
  remove(@Param('id') id: string) {
    return this.hrService.remove(id);
  }
}