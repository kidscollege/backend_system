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
import { FinanceService } from './finance.service.js';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
import { CreateFeePlanDto } from './dto/create-fee-plan.dto.js';
import { RefundPaymentDto } from './dto/refund-payment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
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
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR, Role.PRINCIPAL)
  getFeeStructures() {
    return this.financeService.getFeeStructures();
  }

  @Post('fee-plans')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR)
  createFeePlan(@Body() dto: CreateFeePlanDto) {
    return this.financeService.createFeePlan(dto);
  }

  @Get('fee-plans')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR, Role.PRINCIPAL)
  getFeePlans(@Query('studentId') studentId?: string) {
    return this.financeService.getFeePlans(studentId);
  }

  @Post('fee-plans/:id/invoice')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR)
  invoiceFeePlan(@Param('id') id: string, @Body('dueDate') dueDate?: string) {
    return this.financeService.invoiceFeePlan(id, dueDate);
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
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR, Role.PRINCIPAL)
  getInvoice(@Param('id') id: string) {
    return this.financeService.getInvoice(id);
  }

  // Payments
  @Post('payments')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR)
  recordPayment(@Body() dto: RecordPaymentDto, @CurrentUser() user: any) {
    return this.financeService.recordPayment(dto, user);
  }

  @Get('payments')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR)
  getPayments() {
    return this.financeService.getPayments();
  }

  @Post('payments/:id/refund')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR)
  refundPayment(
    @Param('id') id: string,
    @Body() dto: RefundPaymentDto,
    @CurrentUser() user: any,
  ) {
    return this.financeService.refundPayment(id, dto.reason, user);
  }

  // Student Balance
  @Get('students/:studentId/balance')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR, Role.PRINCIPAL)
  getStudentBalance(@Param('studentId') studentId: string) {
    return this.financeService.getStudentBalances(studentId);
  }

  @Post('invoices/mark-overdue')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR)
  markOverdueInvoices(@CurrentUser() user: any) {
    return this.financeService.markOverdueInvoices(user);
  }


    @Patch('fee-structures/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR)
  updateFeeStructure(@Param('id') id: string, @Body() dto: CreateFeeStructureDto) {
    return this.financeService.updateFeeStructure(id, dto);
  }

  @Delete('fee-structures/:id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR)
  deleteFeeStructure(@Param('id') id: string) {
    return this.financeService.deleteFeeStructure(id);
  }

  @Get('reports/by-term')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR, Role.PRINCIPAL)
  getFeesByTerm() {
    return this.financeService.getFeesPaidByTerm();
  }

  @Get('reports/by-class')
  @Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR, Role.PRINCIPAL)
  getFeesByClass() {
    return this.financeService.getFeesPaidByClass();
  }





@Get('reports/summary')
@Roles(Role.SUPER_ADMIN, Role.MANAGEMENT, Role.BURSAR, Role.PRINCIPAL)
getPaymentsSummary(
  @Query('termId') termId?: string,
  @Query('classId') classId?: string,
  @Query('sessionId') sessionId?: string,
) {
  return this.financeService.getFilteredPaymentsReport({
    termId,
    classId,
    sessionId,
  });
}
}