import { describe, expect, it, vi } from 'vitest';
import { FinanceController } from './finance.controller.js';

describe('FinanceController', () => {
  it('exposes a payment listing endpoint for finance staff', async () => {
    const service = {
      getPayments: vi.fn().mockResolvedValue([{ id: 'pay-1' }]),
    };

    const controller = new FinanceController(service as any);

    await expect(controller.getPayments()).resolves.toEqual([{ id: 'pay-1' }]);
    expect(service.getPayments).toHaveBeenCalled();
  });
});
