import { describe, it, expect, vi } from 'vitest';
import { ResultsService } from './results.service.js';

describe('ResultsService assessment management', () => {
  it('updates an assessment when valid values are supplied', async () => {
    const prisma = {
      assessment: {
        findUnique: vi.fn().mockResolvedValue({ id: 'assessment-1' }),
        update: vi.fn().mockResolvedValue({ id: 'assessment-1', name: 'CA2', maxScore: 30 }),
      },
      term: {
        findUnique: vi.fn().mockResolvedValue({ id: 'term-1' }),
      },
      subject: {
        findUnique: vi.fn().mockResolvedValue({ id: 'subject-1' }),
      },
    } as any;

    const service = new ResultsService(prisma);

    const result = await service.updateAssessment('assessment-1', {
      name: 'CA2',
      maxScore: 30,
    });

    expect(prisma.assessment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'assessment-1' },
        data: expect.objectContaining({
          name: 'CA2',
          maxScore: 30,
        }),
      }),
    );
    expect(result.name).toBe('CA2');
  });

  it('deletes an assessment and its linked scores', async () => {
    const prisma = {
      assessment: {
        findUnique: vi.fn().mockResolvedValue({ id: 'assessment-1' }),
        delete: vi.fn().mockResolvedValue({ id: 'assessment-1' }),
      },
      studentAssessment: {
        deleteMany: vi.fn().mockResolvedValue({ count: 2 }),
      },
    } as any;

    const service = new ResultsService(prisma);

    const result = await service.deleteAssessment('assessment-1');

    expect(prisma.studentAssessment.deleteMany).toHaveBeenCalledWith({
      where: { assessmentId: 'assessment-1' },
    });
    expect(prisma.assessment.delete).toHaveBeenCalledWith({
      where: { id: 'assessment-1' },
    });
    expect(result.id).toBe('assessment-1');
  });
});
