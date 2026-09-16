import { describe, expect, it, vi } from 'vitest';
import { FeeAdjustmentType, InvoiceStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { FinanceService } from './finance.service.js';

describe('FinanceService', () => {
  it('allocates a payment across outstanding installments in order', async () => {
    const payment = { id: 'payment-1' };
    const invoice = {
      id: 'invoice-1',
      status: InvoiceStatus.PENDING,
      amountPaid: new Prisma.Decimal(0),
      totalAmount: new Prisma.Decimal(150),
    };
    const installments = [
      {
        id: 'installment-1',
        installmentNo: 1,
        amount: new Prisma.Decimal(100),
        status: 'PENDING',
        paidAt: null,
        paymentAllocations: [],
      },
      {
        id: 'installment-2',
        installmentNo: 2,
        amount: new Prisma.Decimal(50),
        status: 'PENDING',
        paidAt: null,
        paymentAllocations: [],
      },
    ];
    const tx = {
      numberSequence: { upsert: vi.fn().mockResolvedValue({ nextValue: 2 }) },
      payment: { create: vi.fn().mockResolvedValue(payment) },
      paymentPlan: {
        findUnique: vi.fn().mockResolvedValue({ id: 'plan-1', installments }),
        update: vi.fn(),
      },
      installmentPaymentAllocation: { create: vi.fn() },
      installment: { update: vi.fn() },
      feeInvoice: { update: vi.fn().mockResolvedValue(invoice) },
      auditLog: { create: vi.fn() },
    } as any;
    tx.installment.count = vi.fn().mockResolvedValue(0);
    const prisma = {
      feeInvoice: { findUnique: vi.fn().mockResolvedValue(invoice) },
      $transaction: vi.fn(async (callback: (client: any) => Promise<unknown>) => callback(tx)),
    } as any;

    const service = new FinanceService(prisma);
    await service.recordPayment({
      invoiceId: 'invoice-1',
      amount: 125,
      method: PaymentMethod.CASH,
    });

    expect(tx.installmentPaymentAllocation.create).toHaveBeenCalledTimes(2);
    expect(tx.installmentPaymentAllocation.create.mock.calls.map((call: any[]) => call[0].data.amount.toString())).toEqual(['100', '25']);
    expect(tx.installment.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'installment-1' },
      data: expect.objectContaining({ status: 'PAID' }),
    }));
  });

  it('spreads a fee-plan discount without creating negative invoice items', async () => {
    const prisma = {
      studentFeePlan: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'plan-1',
          studentId: 'student-1',
          sessionId: 'session-1',
          termId: null,
          status: 'ACTIVE',
          discount: new Prisma.Decimal(150),
          items: [
            { feeStructureId: 'fee-1', amount: new Prisma.Decimal(100), feeStructure: { name: 'Tuition' } },
            { feeStructureId: 'fee-2', amount: new Prisma.Decimal(100), feeStructure: { name: 'Books' } },
          ],
        }),
      },
    } as any;
    const service = new FinanceService(prisma);
    const createInvoice = vi.spyOn(service, 'createInvoice').mockResolvedValue({} as any);

    await service.invoiceFeePlan('plan-1', '2026-09-20');

    expect(createInvoice).toHaveBeenCalledWith(expect.objectContaining({
      items: [
        { description: 'Tuition', amount: '0', feeStructureId: 'fee-1' },
        { description: 'Books', amount: '50', feeStructureId: 'fee-2' },
      ],
    }));
  });

  it('creates an approved scholarship adjustment within the fee-plan total', async () => {
    const adjustment = { id: 'adjustment-1', amount: new Prisma.Decimal(250) };
    const prisma = {
      studentFeePlan: {
        findUnique: vi.fn().mockResolvedValue({
          status: 'ACTIVE',
          discount: new Prisma.Decimal(100),
          items: [{ amount: new Prisma.Decimal(1000) }],
          adjustments: [],
        }),
      },
      studentFeePlanAdjustment: { create: vi.fn().mockResolvedValue(adjustment) },
    } as any;
    const service = new FinanceService(prisma);

    await expect(service.createFeeAdjustment('plan-1', {
      type: FeeAdjustmentType.SCHOLARSHIP,
      amount: 250,
      reason: 'Academic award',
    }, { id: 'admin-1' })).resolves.toEqual(adjustment);
    expect(prisma.studentFeePlanAdjustment.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ approvedById: 'admin-1' }),
    }));
  });

  it('summarizes payment-plan installments by status', async () => {
    const prisma = {
      installment: {
        findMany: vi.fn().mockResolvedValue([
          { amount: new Prisma.Decimal(100), status: 'PAID' },
          { amount: new Prisma.Decimal(150), status: 'OVERDUE' },
          { amount: new Prisma.Decimal(200), status: 'PENDING' },
        ]),
      },
    } as any;
    const service = new FinanceService(prisma);

    await expect(service.getPaymentPlanSummary()).resolves.toMatchObject({
      totalCount: 3,
      totalAmount: 450,
      outstandingAmount: 350,
      byStatus: {
        PAID: { count: 1, amount: 100 },
        OVERDUE: { count: 1, amount: 150 },
        PENDING: { count: 1, amount: 200 },
      },
    });
  });

  it('returns a complete student finance statement', async () => {
    const prisma = {
      student: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'student-1',
          admissionNumber: 'ADM-1',
          firstName: 'Ada',
          lastName: 'Cole',
        }),
      },
      feeInvoice: {
        findMany: vi.fn().mockResolvedValue([
          {
            totalAmount: new Prisma.Decimal(1000),
            amountPaid: new Prisma.Decimal(400),
            items: [],
            payments: [],
            paymentPlan: null,
          },
        ]),
      },
    } as any;
    const service = new FinanceService(prisma);

    await expect(service.getStudentStatement('student-1')).resolves.toMatchObject({
      student: { id: 'student-1', admissionNumber: 'ADM-1' },
      totalInvoiced: 1000,
      totalPaid: 400,
      totalOutstanding: 600,
      invoices: [{ amountPaid: new Prisma.Decimal(400) }],
    });
  });

  it('summarizes refunded payments for finance staff', async () => {
    const prisma = {
      payment: {
        findMany: vi.fn().mockResolvedValue([
          { amount: new Prisma.Decimal(100), status: PaymentStatus.REFUNDED },
          { amount: new Prisma.Decimal(75), status: PaymentStatus.REFUNDED },
        ]),
      },
    } as any;
    const service = new FinanceService(prisma);

    await expect(service.getRefundReport()).resolves.toMatchObject({
      totalRefunded: 175,
      count: 2,
    });
  });

  it('refunds a successful payment and restores the invoice balance', async () => {
    const payment = {
      id: 'payment-1',
      invoiceId: 'invoice-1',
      amount: { sub: vi.fn() },
      status: PaymentStatus.SUCCESS,
      invoice: {
        id: 'invoice-1',
        totalAmount: { sub: vi.fn() },
        amountPaid: { sub: vi.fn().mockReturnValue({ equals: vi.fn().mockReturnValue(true) }) },
      },
    };
    const refundedPayment = { ...payment, status: PaymentStatus.REFUNDED };
    const invoice = { id: 'invoice-1', status: InvoiceStatus.PENDING };
    const prisma = {
      payment: { findUnique: vi.fn().mockResolvedValue(payment) },
      $transaction: vi.fn(async (callback: (tx: any) => Promise<unknown>) => callback({
        payment: { update: vi.fn().mockResolvedValue(refundedPayment) },
        feeInvoice: { update: vi.fn().mockResolvedValue(invoice) },
        auditLog: { create: vi.fn().mockResolvedValue({}) },
      })),
    } as any;

    const service = new FinanceService(prisma);
    const result = await service.refundPayment('payment-1', 'Duplicate payment', { id: 'user-1' });

    expect(result).toEqual({ payment: refundedPayment, invoice });
    expect(prisma.payment.findUnique).toHaveBeenCalledWith({
      where: { id: 'payment-1' },
      include: {
        invoice: true,
        installmentAllocations: { include: { installment: true } },
      },
    });
  });
});