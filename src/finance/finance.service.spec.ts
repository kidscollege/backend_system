import { describe, expect, it, vi } from 'vitest';
import { InvoiceStatus, PaymentStatus } from '@prisma/client';
import { FinanceService } from './finance.service.js';

describe('FinanceService', () => {
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
      include: { invoice: true },
    });
  });
});