import { describe, expect, it, vi } from 'vitest';
import { ApplicationStatus } from '@prisma/client';
import { AdmissionsService } from './admissions.service.js';

describe('AdmissionsService', () => {
  it('resolves the active academic session and matching class for an applicant', async () => {
    const prisma = {
      academicSession: {
        findFirst: vi.fn().mockResolvedValue({ id: 'session-1', name: '2025/2026' }),
      },
      class: {
        findFirst: vi.fn().mockResolvedValue({ id: 'class-1', name: 'JSS 1' }),
      },
    } as any;

    const service = new AdmissionsService(prisma);

    const result = await service.resolveAdmissionPlacement('JSS 1');

    expect(prisma.academicSession.findFirst).toHaveBeenCalledWith({
      where: { isCurrent: true },
      select: { id: true },
    });
    expect(prisma.class.findFirst).toHaveBeenCalledWith({
      where: {
        name: 'JSS 1',
        sessionId: 'session-1',
      },
      select: { id: true, name: true },
    });
    expect(result).toEqual({ sessionId: 'session-1', classId: 'class-1', sectionId: null });
  });

  it('stores uploaded documents along with the application payload', async () => {
    const prisma = {
      academicSession: {
        findFirst: vi.fn().mockResolvedValue({ id: 'session-1', name: '2025/2026' }),
      },
      class: {
        findFirst: vi.fn().mockResolvedValue({ id: 'class-1', name: 'JSS 1' }),
      },
      admissionApplication: {
        create: vi.fn().mockResolvedValue({ id: 'app-1', status: ApplicationStatus.SUBMITTED }),
        count: vi.fn().mockResolvedValue(0),
      },
    } as any;

    const service = new AdmissionsService(prisma);

    await service.createApplication({
      firstName: 'Ada',
      lastName: 'Okafor',
      applyingClass: 'JSS 1',
      documents: [
        { name: 'Birth Certificate', type: 'pdf', fileUrl: '/docs/birth.pdf' },
      ],
      sessionId: 'session-1',
    } as any);

    expect(prisma.admissionApplication.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          firstName: 'Ada',
          lastName: 'Okafor',
          applyingClass: 'JSS 1',
          documents: expect.arrayContaining([
            expect.objectContaining({
              name: 'Birth Certificate',
              fileUrl: '/docs/birth.pdf',
            }),
          ]),
        }),
      }),
    );
  });

  it('requires an interview date when scheduling an interview', async () => {
    const prisma = {
      admissionApplication: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'app-1',
          status: ApplicationStatus.UNDER_REVIEW,
          notes: null,
          student: null,
        }),
      },
    } as any;

    const service = new AdmissionsService(prisma);

    await expect(
      service.advanceApplication('app-1', {
        status: ApplicationStatus.INTERVIEW_SCHEDULED,
      } as any),
    ).rejects.toThrow('Interview date is required');
  });
});
