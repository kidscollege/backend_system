import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdmissionsService } from './admissions.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { ReviewApplicationDto } from './dto/review-application.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role, ApplicationStatus } from '@prisma/client';

@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  // Public endpoint - anyone can submit an application
  @Post('applications')
  createApplication(@Body() dto: CreateApplicationDto) {
    return this.admissionsService.createApplication(dto);
  }

  // Protected endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('applications')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.HR_ADMIN)
  findAll(@Query('status') status?: ApplicationStatus) {
    return this.admissionsService.findAll(status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('applications/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL, Role.HR_ADMIN)
  findOne(@Param('id') id: string) {
    return this.admissionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('applications/:id/review')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  review(
    @Param('id') id: string,
    @Body() dto: ReviewApplicationDto,
    @CurrentUser() user: any,
  ) {
    return this.admissionsService.reviewApplication(id, dto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('applications/:id/admit')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  admit(@Param('id') id: string, @CurrentUser() user: any) {
    return this.admissionsService.admitApplication(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('stats')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.PRINCIPAL)
  getStats() {
    return this.admissionsService.getStats();
  }
}