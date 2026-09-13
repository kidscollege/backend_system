import { describe, expect, it, vi } from 'vitest';
import { StudentsController } from './students.controller.js';

describe('StudentsController', () => {
  it('passes the current user into student lookup for parent-owned records', async () => {
    const service = {
      findOne: vi.fn().mockResolvedValue({ id: 'student-1' }),
    };

    const controller = new StudentsController(service as any);
    const user = { id: 'parent-1', role: 'PARENT' };

    await controller.findOne('student-1', user as any);

    expect(service.findOne).toHaveBeenCalledWith('student-1', user);
  });
});
