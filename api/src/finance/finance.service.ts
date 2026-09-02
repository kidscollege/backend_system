import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
import { InvoiceStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { Prisma } from '@prisma/client';


@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await this.prisma.feeInvoice.count();
    const next = (count + 1).toString().padStart(5, '0');
    return `INV${year}${next}`; // e.g. INV2600001
  }

  private async generateReceiptNumber(): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await this.prisma.payment.count({
      where: { status: PaymentStatus.SUCCESS },
    });
    const next = (count + 1).toString().padStart(5, '0');
    return `RCPT${year}${next}`;
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

    const invoiceNumber = await this.generateInvoiceNumber();

    const invoice = await this.prisma.feeInvoice.create({
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

    return invoice;
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

  async recordPayment(dto: RecordPaymentDto) {
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

    const receiptNumber = await this.generateReceiptNumber();

    const result = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          invoiceId: dto.invoiceId,
          amount: paymentAmount,
          method: dto.method,
          status: PaymentStatus.SUCCESS,
          receiptNumber,
          paidAt: new Date(),
          notes: dto.notes,
          paystackRef: dto.paystackRef,
        },
      });

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

      return { payment, invoice: updatedInvoice };
    });

    return result;
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
}