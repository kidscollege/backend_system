import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
import { CreateFeePlanDto } from './dto/create-fee-plan.dto.js';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto.js';
import { CreateFeeAdjustmentDto } from './dto/create-fee-adjustment.dto.js';
import { InvoiceStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class FinanceService {
  constructor(
    private prisma: PrismaService,
    private configService?: ConfigService,
  ) {}

  private getPaystackSecret() {
    const secret = this.configService?.get<string>('PAYSTACK_SECRET_KEY');
    if (!secret) throw new BadRequestException('Paystack is not configured');
    return secret;
  }

  private async nextDocumentNumber(
    tx: Prisma.TransactionClient,
    name: string,
    prefix: string,
  ) {
    const sequence = await tx.numberSequence.upsert({
      where: { name },
      update: { nextValue: { increment: 1 } },
      create: { name, nextValue: 2 },
    });
    const value = sequence.nextValue - 1;
    const year = new Date().getFullYear().toString().slice(-2);
    return `${prefix}${year}${value.toString().padStart(5, '0')}`;
  }

  // ======================
  // FEE STRUCTURE
  // ======================

  async createFeeStructure(dto: CreateFeeStructureDto) {
    return this.prisma.feeStructure.create({
      data: {
        name: dto.name,
        description: dto.description,
        amount: new Prisma.Decimal(dto.amount),
        classId: dto.classId,
        sessionId: dto.sessionId,
        termId: dto.termId,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async getFeeStructures() {
    return this.prisma.feeStructure.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  // ======================
  // INVOICE
  // ======================

  async createInvoice(dto: CreateInvoiceDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Invoice must have at least one item');
    }

    const totalAmount = dto.items.reduce(
      (sum, item) => sum + Number(item.amount),
      0,
    );

    const invoice = await this.prisma.$transaction(async (tx) => {
      const invoiceNumber = await this.nextDocumentNumber(tx, 'invoice', 'INV');
      return tx.feeInvoice.create({
        data: {
          studentId: dto.studentId,
          invoiceNumber,
          totalAmount: new Prisma.Decimal(totalAmount),
          amountPaid: new Prisma.Decimal(0),
          balance: new Prisma.Decimal(totalAmount),
          status: InvoiceStatus.PENDING,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          sessionId: dto.sessionId,
          termId: dto.termId,
          feePlanId: dto.feePlanId,
          items: {
            create: dto.items.map((item) => ({
              description: item.description,
              amount: new Prisma.Decimal(item.amount),
              feeStructureId: item.feeStructureId,
            })),
          },
        },
        include: {
          items: true,
          student: {
            select: {
              id: true,
              admissionNumber: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    });

    return invoice;
  }

  async initializePaystackPayment(invoiceId: string, email: string) {
    const invoice = await this.prisma.feeInvoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.balance.lessThanOrEqualTo(0)) throw new BadRequestException('Invoice is already paid');

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.getPaystackSecret()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: invoice.balance.mul(100).toFixed(0),
        metadata: { invoiceId: invoice.id },
      }),
    });
    const payload = await response.json() as { status?: boolean; message?: string; data?: unknown };
    if (!response.ok || !payload.status) {
      throw new BadRequestException(payload.message || 'Paystack initialization failed');
    }
    return payload.data;
  }

  async confirmPaystackPayment(data: { invoiceId: string; reference: string; amountKobo: number }) {
    const expectedAmount = await this.prisma.feeInvoice.findUnique({
      where: { id: data.invoiceId },
      select: { balance: true },
    });
    if (!expectedAmount) throw new NotFoundException('Invoice not found');
    const amount = new Prisma.Decimal(data.amountKobo).div(100);
    if (amount.greaterThan(expectedAmount.balance)) {
      throw new BadRequestException('Paystack amount exceeds invoice balance');
    }
    return this.recordPayment({
      invoiceId: data.invoiceId,
      amount: amount.toNumber(),
      method: PaymentMethod.PAYSTACK,
      paystackRef: data.reference,
    });
  }

  async createFeePlan(dto: CreateFeePlanDto) {
    if (!dto.feeStructureIds.length) {
      throw new BadRequestException('A fee plan must contain at least one fee structure');
    }

    const student = await this.prisma.student.findUnique({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const structures = await this.prisma.feeStructure.findMany({
      where: { id: { in: dto.feeStructureIds }, isActive: true },
    });
    if (structures.length !== dto.feeStructureIds.length) {
      throw new BadRequestException('One or more fee structures are invalid or inactive');
    }

    const discount = new Prisma.Decimal(dto.discount || 0);
    const subtotal = structures.reduce((sum, item) => sum.add(item.amount), new Prisma.Decimal(0));
    if (discount.greaterThan(subtotal)) throw new BadRequestException('Discount cannot exceed the fee plan total');

    return this.prisma.studentFeePlan.create({
      data: {
        studentId: dto.studentId,
        sessionId: dto.sessionId,
        termId: dto.termId,
        discount,
        items: { create: structures.map((item) => ({ feeStructureId: item.id, amount: item.amount })) },
      },
      include: { items: { include: { feeStructure: true } }, student: true },
    });
  }

  async getFeePlans(studentId?: string) {
    return this.prisma.studentFeePlan.findMany({
      where: studentId ? { studentId } : undefined,
      include: { items: { include: { feeStructure: true } }, adjustments: true, student: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createFeeAdjustment(planId: string, dto: CreateFeeAdjustmentDto, currentUser?: any) {
    const plan = await this.prisma.studentFeePlan.findUnique({
      where: { id: planId },
      include: { items: true, adjustments: true },
    });
    if (!plan) throw new NotFoundException('Fee plan not found');
    if (plan.status !== 'ACTIVE') throw new BadRequestException('Only active fee plans can be adjusted');

    const subtotal = plan.items.reduce((sum, item) => sum.add(item.amount), new Prisma.Decimal(0));
    const existingAdjustments = plan.adjustments.reduce((sum, item) => sum.add(item.amount), new Prisma.Decimal(0));
    const amount = new Prisma.Decimal(dto.amount);
    if (existingAdjustments.add(plan.discount).add(amount).greaterThan(subtotal)) {
      throw new BadRequestException('Total discounts, scholarships, and waivers cannot exceed the fee plan total');
    }

    return this.prisma.studentFeePlanAdjustment.create({
      data: {
        planId,
        type: dto.type,
        amount,
        reason: dto.reason,
        approvedById: currentUser?.id,
      },
    });
  }

  async createPaymentPlan(dto: CreatePaymentPlanDto) {
    const invoice = await this.prisma.feeInvoice.findUnique({ where: { id: dto.invoiceId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.status === InvoiceStatus.PAID || invoice.balance.lessThanOrEqualTo(0)) {
      throw new BadRequestException('A paid invoice cannot have a payment plan');
    }

    const existing = await this.prisma.paymentPlan.findUnique({ where: { invoiceId: dto.invoiceId } });
    if (existing) throw new BadRequestException('Invoice already has a payment plan');

    const total = invoice.balance;
    const baseAmount = total.div(dto.installmentCount);
    const firstDueDate = new Date(dto.firstDueDate);
    const installments = Array.from({ length: dto.installmentCount }, (_, index) => ({
      installmentNo: index + 1,
      amount: index === dto.installmentCount - 1
        ? total.sub(baseAmount.mul(dto.installmentCount - 1))
        : baseAmount,
      dueDate: new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + index, firstDueDate.getDate()),
    }));

    return this.prisma.paymentPlan.create({
      data: {
        invoiceId: dto.invoiceId,
        installmentCount: dto.installmentCount,
        installments: { create: installments },
      },
      include: { invoice: true, installments: { orderBy: { installmentNo: 'asc' } } },
    });
  }

  async getPaymentPlans(invoiceId?: string) {
    return this.prisma.paymentPlan.findMany({
      where: invoiceId ? { invoiceId } : undefined,
      include: { invoice: { include: { student: true } }, installments: { orderBy: { installmentNo: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async invoiceFeePlan(planId: string, dueDate?: string) {
    const plan = await this.prisma.studentFeePlan.findUnique({
      where: { id: planId },
      include: { items: { include: { feeStructure: true } }, adjustments: true },
    });
    if (!plan) throw new NotFoundException('Fee plan not found');
    if (plan.status !== 'ACTIVE') throw new BadRequestException('Only active fee plans can be invoiced');

    const totalAdjustments = (plan.adjustments ?? []).reduce(
      (sum, adjustment) => sum.add(adjustment.amount),
      new Prisma.Decimal(plan.discount),
    );
    let remainingDiscount = totalAdjustments;
    const items = plan.items.map((item) => {
      const itemAmount = new Prisma.Decimal(item.amount);
      const appliedDiscount = Prisma.Decimal.min(remainingDiscount, itemAmount);
      remainingDiscount = remainingDiscount.sub(appliedDiscount);

      return {
        description: item.feeStructure.name,
        amount: itemAmount.sub(appliedDiscount).toString(),
        feeStructureId: item.feeStructureId,
      };
    });

    return this.createInvoice({
      studentId: plan.studentId,
      sessionId: plan.sessionId,
      termId: plan.termId || undefined,
      dueDate,
      feePlanId: plan.id,
      items,
    });
  }

  async getInvoices(studentId?: string) {
    return this.prisma.feeInvoice.findMany({
      where: studentId ? { studentId } : undefined,
      include: {
        student: {
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            lastName: true,
          },
        },
        items: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInvoice(id: string) {
    const invoice = await this.prisma.feeInvoice.findUnique({
      where: { id },
      include: {
        student: true,
        items: true,
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  // ======================
  // PAYMENT
  // ======================

  async recordPayment(dto: RecordPaymentDto, currentUser?: any) {
    if (dto.paystackRef) {
      const existingPayment = await this.prisma.payment.findUnique({
        where: { paystackRef: dto.paystackRef },
        include: {
          invoice: {
            include: {
              items: true,
              payments: true,
              student: {
                select: {
                  id: true,
                  admissionNumber: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      if (existingPayment) {
        return { payment: existingPayment, invoice: existingPayment.invoice };
      }
    }

    const invoice = await this.prisma.feeInvoice.findUnique({
      where: { id: dto.invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice is already fully paid');
    }

    const paymentAmount = new Prisma.Decimal(dto.amount);
    const newAmountPaid = invoice.amountPaid.add(paymentAmount);
    const newBalance = invoice.totalAmount.sub(newAmountPaid);

    if (newBalance.lessThan(0)) {
      throw new BadRequestException('Payment amount exceeds invoice balance');
    }

    let newStatus: InvoiceStatus = InvoiceStatus.PARTIAL;
    if (newBalance.equals(0)) {
      newStatus = InvoiceStatus.PAID;
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const receiptNumber = await this.nextDocumentNumber(tx, 'receipt', 'RCPT');
      const payment = await tx.payment.create({
        data: {
          invoiceId: dto.invoiceId,
          amount: paymentAmount,
          method: dto.method,
          status: PaymentStatus.SUCCESS,
          receiptNumber,
          paidAt: new Date(),
          recordedById: currentUser?.id || null,
          notes: dto.notes,
          paystackRef: dto.paystackRef,
        },
      });

      const paymentPlan = await tx.paymentPlan.findUnique({
        where: { invoiceId: dto.invoiceId },
        include: {
          installments: {
            where: { status: { not: 'CANCELLED' } },
            include: { paymentAllocations: true },
            orderBy: { installmentNo: 'asc' },
          },
        },
      });

      if (paymentPlan?.installments.length) {
        let remainingPayment = paymentAmount;

        for (const installment of paymentPlan.installments) {
          if (remainingPayment.lessThanOrEqualTo(0)) break;

          const alreadyAllocated = installment.paymentAllocations.reduce(
            (sum, allocation) => sum.add(allocation.amount),
            new Prisma.Decimal(0),
          );
          const remainingInstallment = installment.amount.sub(alreadyAllocated);
          if (remainingInstallment.lessThanOrEqualTo(0)) continue;

          const allocationAmount = Prisma.Decimal.min(remainingPayment, remainingInstallment);
          await tx.installmentPaymentAllocation.create({
            data: {
              paymentId: payment.id,
              installmentId: installment.id,
              amount: allocationAmount,
            },
          });

          remainingPayment = remainingPayment.sub(allocationAmount);
          const fullyPaid = allocationAmount.equals(remainingInstallment);
          await tx.installment.update({
            where: { id: installment.id },
            data: {
              status: fullyPaid ? 'PAID' : installment.status,
              paidAt: fullyPaid ? new Date() : installment.paidAt,
            },
          });
        }

        const incompleteInstallments = await tx.installment.count({
          where: {
            paymentPlanId: paymentPlan.id,
            status: { notIn: ['PAID', 'CANCELLED'] },
          },
        });
        if (incompleteInstallments === 0) {
          await tx.paymentPlan.update({
            where: { id: paymentPlan.id },
            data: { status: 'COMPLETED' },
          });
        }
      }

      const updatedInvoice = await tx.feeInvoice.update({
        where: { id: dto.invoiceId },
        data: {
          amountPaid: newAmountPaid,
          balance: newBalance,
          status: newStatus,
        },
        include: {
          items: true,
          payments: true,
          student: {
            select: {
              id: true,
              admissionNumber: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          userId: currentUser?.id || null,
          action: 'FEE_PAYMENT',
          entity: 'Payment',
          entityId: payment.id,
          metadata: {
            invoiceId: dto.invoiceId,
            amount: Number(paymentAmount),
            method: dto.method,
            status: PaymentStatus.SUCCESS,
          },
        },
      });

      return { payment, invoice: updatedInvoice };
    });

    return result;
  }

  async getPayments() {
    return this.prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        invoice: {
          include: {
            student: {
              select: {
                id: true,
                admissionNumber: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async refundPayment(id: string, reason: string, currentUser?: any) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: true,
        installmentAllocations: { include: { installment: true } },
      },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== PaymentStatus.SUCCESS) {
      throw new BadRequestException('Only successful payments can be refunded');
    }

    return this.prisma.$transaction(async (tx) => {
      const refundedPayment = await tx.payment.update({
        where: { id },
        data: {
          status: PaymentStatus.REFUNDED,
          refundedAt: new Date(),
          refundReason: reason,
        },
      });

      const installmentAllocations = payment.installmentAllocations ?? [];
      if (installmentAllocations.length) {
        await tx.installmentPaymentAllocation.deleteMany({ where: { paymentId: id } });

        for (const allocation of installmentAllocations) {
          const remainingAllocations = await tx.installmentPaymentAllocation.findMany({
            where: { installmentId: allocation.installmentId },
          });
          const allocatedAmount = remainingAllocations.reduce(
            (sum, item) => sum.add(item.amount),
            new Prisma.Decimal(0),
          );
          const installmentStatus = allocatedAmount.greaterThanOrEqualTo(allocation.installment.amount)
            ? 'PAID'
            : allocation.installment.dueDate < new Date()
              ? 'OVERDUE'
              : 'PENDING';

          await tx.installment.update({
            where: { id: allocation.installmentId },
            data: {
              status: installmentStatus,
              paidAt: installmentStatus === 'PAID' ? allocation.installment.paidAt : null,
            },
          });
        }

        await tx.paymentPlan.updateMany({
          where: { invoiceId: payment.invoiceId, status: 'COMPLETED' },
          data: { status: 'ACTIVE' },
        });
      }

      const newAmountPaid = payment.invoice.amountPaid.sub(payment.amount);
      const newBalance = payment.invoice.totalAmount.sub(newAmountPaid);
      const invoiceStatus = newAmountPaid.equals(0)
        ? InvoiceStatus.PENDING
        : InvoiceStatus.PARTIAL;

      const invoice = await tx.feeInvoice.update({
        where: { id: payment.invoiceId },
        data: {
          amountPaid: newAmountPaid,
          balance: newBalance,
          status: invoiceStatus,
        },
        include: { items: true, payments: true, student: true },
      });

      await tx.auditLog.create({
        data: {
          userId: currentUser?.id || null,
          action: 'FEE_PAYMENT_REFUNDED',
          entity: 'Payment',
          entityId: id,
          metadata: { invoiceId: payment.invoiceId, amount: Number(payment.amount), reason },
        },
      });

      return { payment: refundedPayment, invoice };
    });
  }

  async getStudentBalances(studentId: string) {
    const invoices = await this.prisma.feeInvoice.findMany({
      where: {
        studentId,
        status: { in: [InvoiceStatus.PENDING, InvoiceStatus.PARTIAL, InvoiceStatus.OVERDUE] },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalBalance = invoices.reduce(
      (sum, inv) => sum + Number(inv.balance),
      0,
    );

    return {
      studentId,
      totalBalance,
      invoices,
    };
  }

  async getStudentStatement(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        admissionNumber: true,
        firstName: true,
        lastName: true,
      },
    });
    if (!student) throw new NotFoundException('Student not found');

    const invoices = await this.prisma.feeInvoice.findMany({
      where: { studentId },
      include: {
        items: true,
        payments: {
          where: { status: PaymentStatus.SUCCESS },
          orderBy: { paidAt: 'asc' },
        },
        paymentPlan: {
          include: { installments: { orderBy: { installmentNo: 'asc' } } },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const totalInvoiced = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.totalAmount),
      0,
    );
    const totalPaid = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.amountPaid),
      0,
    );

    return {
      student,
      totalInvoiced,
      totalPaid,
      totalOutstanding: totalInvoiced - totalPaid,
      invoices,
    };
  }

  async getReconciliationReport() {
    const invoices = await this.prisma.feeInvoice.findMany({
      include: {
        payments: { where: { status: PaymentStatus.SUCCESS } },
        student: {
          select: {
            admissionNumber: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return invoices.map((invoice) => {
      const successfulPayments = invoice.payments.reduce(
        (sum, payment) => sum.add(payment.amount),
        new Prisma.Decimal(0),
      );
      const difference = invoice.amountPaid.sub(successfulPayments);
      return {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        student: invoice.student,
        invoiceAmountPaid: Number(invoice.amountPaid),
        successfulPayments: Number(successfulPayments),
        difference: Number(difference),
        isBalanced: difference.equals(0),
      };
    });
  }

  async getPaymentPlanSummary() {
    const installments = await this.prisma.installment.findMany({
      include: {
        paymentPlan: {
          include: {
            invoice: {
              select: { invoiceNumber: true, student: { select: { firstName: true, lastName: true } } },
            },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    const summary = installments.reduce(
      (result, installment) => {
        const amount = Number(installment.amount);
        result.totalCount += 1;
        result.totalAmount += amount;
        result.byStatus[installment.status].count += 1;
        result.byStatus[installment.status].amount += amount;
        return result;
      },
      {
        totalCount: 0,
        totalAmount: 0,
        byStatus: {
          PENDING: { count: 0, amount: 0 },
          PAID: { count: 0, amount: 0 },
          OVERDUE: { count: 0, amount: 0 },
          CANCELLED: { count: 0, amount: 0 },
        },
      },
    );

    return {
      ...summary,
      outstandingAmount: summary.byStatus.PENDING.amount + summary.byStatus.OVERDUE.amount,
      installments,
    };
  }

  async markOverdueInvoices(currentUser?: any) {
    const now = new Date();
    const result = await this.prisma.feeInvoice.updateMany({
      where: {
        dueDate: { lt: now },
        status: { in: [InvoiceStatus.PENDING, InvoiceStatus.PARTIAL] },
        balance: { gt: 0 },
      },
      data: { status: InvoiceStatus.OVERDUE },
    });
    const installmentResult = await this.prisma.installment.updateMany({
      where: {
        dueDate: { lt: now },
        status: 'PENDING',
      },
      data: { status: 'OVERDUE' },
    });

    if (result.count > 0 || installmentResult.count > 0) {
      await this.prisma.auditLog.create({
        data: {
          userId: currentUser?.id || null,
          action: 'INVOICES_MARKED_OVERDUE',
          entity: 'FeeInvoice',
          metadata: {
            count: result.count,
            installmentCount: installmentResult.count,
            processedAt: now.toISOString(),
          },
        },
      });
    }

    return { updated: result.count, installmentsUpdated: installmentResult.count };
  }

    async updateFeeStructure(id: string, dto: CreateFeeStructureDto) {
    const item = await this.prisma.feeStructure.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Fee structure not found');

    return this.prisma.feeStructure.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        amount: new Prisma.Decimal(dto.amount),
        classId: dto.classId,
        sessionId: dto.sessionId,
        termId: dto.termId,
        isActive: dto.isActive ?? item.isActive,
      },
    });
  }

  async deleteFeeStructure(id: string) {
    const item = await this.prisma.feeStructure.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Fee structure not found');

    return this.prisma.feeStructure.delete({ where: { id } });
  }

    // ======================
  // REPORTS
  // ======================

  async getFeesPaidByTerm() {
    const payments = await this.prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      include: {
        invoice: true,
      },
    });

    // Get all terms so we can map names
    const terms = await this.prisma.term.findMany();
    const termMap = new Map(terms.map((t) => [t.id, t.name]));

    const map: Record<
      string,
      { termId: string | null; termName: string; total: number; count: number }
    > = {};

    for (const p of payments) {
      const termId = p.invoice?.termId || 'none';
      const termName = termId !== 'none' ? termMap.get(termId) || 'Unknown Term' : 'No Term';

      if (!map[termId]) {
        map[termId] = {
          termId: p.invoice?.termId || null,
          termName,
          total: 0,
          count: 0,
        };
      }

      map[termId].total += Number(p.amount);
      map[termId].count += 1;
    }

    return Object.values(map);
  }

  async getFeesPaidByClass() {
    const payments = await this.prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      include: {
        invoice: {
          include: {
            student: true,
          },
        },
      },
    });

    // Get all classes so we can map names
    const classes = await this.prisma.class.findMany();
    const classMap = new Map(classes.map((c) => [c.id, c.name]));

    const map: Record<
      string,
      { classId: string | null; className: string; total: number; count: number }
    > = {};

    for (const p of payments) {
      const classId = p.invoice?.student?.currentClassId || 'none';
      const className =
        classId !== 'none' ? classMap.get(classId) || 'Unknown Class' : 'Unassigned';

      if (!map[classId]) {
        map[classId] = {
          classId: p.invoice?.student?.currentClassId || null,
          className,
          total: 0,
          count: 0,
        };
      }

      map[classId].total += Number(p.amount);
      map[classId].count += 1;
    }

    return Object.values(map);
  }


  async getFilteredPaymentsReport(filters: {
  termId?: string;
  classId?: string;
  sessionId?: string;
}) {
  const payments = await this.prisma.payment.findMany({
    where: {
      status: 'SUCCESS',
      invoice: {
        ...(filters.termId ? { termId: filters.termId } : {}),
        ...(filters.sessionId ? { sessionId: filters.sessionId } : {}),
        ...(filters.classId
          ? {
              student: {
                currentClassId: filters.classId,
              },
            }
          : {}),
      },
    },
  });

  const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return {
    total,
    count: payments.length,
    filters,
  };
}
}