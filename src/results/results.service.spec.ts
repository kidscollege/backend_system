import { describe, it, expect, vi } from 'vitest';
import { ResultsService } from './results.service.js';

describe('ResultsService assessment management', () => {
  it('calculates percentage and grade bands for class results', async () => {
    const prisma = {
      assessment: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'assessment-1',
          subjectId: 'subject-1',
          maxScore: 100,
          subject: { name: 'Mathematics' },
          term: { name: 'First Term' },
        }),
      },
      classSubject: { findFirst: vi.fn() },
      student: {
        findMany: vi.fn().mockResolvedValue([
          { id: 'student-1', admissionNumber: 'ADM-1', firstName: 'Ada', lastName: 'Cole' },
        ]),
      },
      studentAssessment: {
        findMany: vi.fn().mockResolvedValue([
          { studentId: 'student-1', score: 82, remark: null },
        ]),
      },
    } as any;
    const service = new ResultsService(prisma);

    await expect(service.getClassResults('class-1', 'assessment-1')).resolves.toMatchObject({
      results: [{ score: 82, grading: { percentage: 82, grade: 'A', remark: 'Excellent' } }],
    });
  });

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
      assessment: {
        findUnique: vi.fn().mockResolvedValue({ id: 'assessment-1' }),
        update: vi.fn().mockResolvedValue({ id: 'assessment-1', name: 'CA2', maxScore: 30 }),
        aggregate: vi.fn().mockResolvedValue({ _sum: { weight: 0 } }),
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

  it('rejects assessment weights above the subject-term total', async () => {
    const prisma = {
      term: { findUnique: vi.fn().mockResolvedValue({ id: 'term-1' }) },
      subject: { findUnique: vi.fn().mockResolvedValue({ id: 'subject-1' }) },
      assessment: { aggregate: vi.fn().mockResolvedValue({ _sum: { weight: 90 } }) },
    } as any;
    const service = new ResultsService(prisma);

    await expect(service.createAssessment({
      termId: 'term-1', subjectId: 'subject-1', name: 'Exam', maxScore: 60, weight: 20,
    })).rejects.toThrow('Assessment weights for a subject and term cannot exceed 100');
  });
});
