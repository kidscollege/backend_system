import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FinanceService } from './finance.service.js';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // Fee Structures
  @Post('fee-structures')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR)
  createFeeStructure(@Body() dto: CreateFeeStructureDto) {
    return this.financeService.createFeeStructure(dto);
  }

  @Get('fee-structures')
  getFeeStructures() {
    return this.financeService.getFeeStructures();
  }

  // Invoices
  @Post('invoices')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR)
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.financeService.createInvoice(dto);
  }

  @Get('invoices')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR, Role.PRINCIPAL)
  getInvoices(@Query('studentId') studentId?: string) {
    return this.financeService.getInvoices(studentId);
  }

  @Get('invoices/:id')
  getInvoice(@Param('id') id: string) {
    return this.financeService.getInvoice(id);
  }

  // Payments
  @Post('payments')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR)
  recordPayment(@Body() dto: RecordPaymentDto) {
    return this.financeService.recordPayment(dto);
  }

  // Student Balance
  @Get('students/:studentId/balance')
  getStudentBalance(@Param('studentId') studentId: string) {
    return this.financeService.getStudentBalances(studentId);
  }
}