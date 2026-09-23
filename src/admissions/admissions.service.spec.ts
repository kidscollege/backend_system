import { describe, expect, it, vi } from 'vitest';
import { ApplicationStatus } from '@prisma/client';
import { AdmissionsService } from './admissions.service.js';

describe('AdmissionsService', () => {
  it('resolves the active academic session and matching class for an applicant', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'app-1', status: ApplicationStatus.SUBMITTED });
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
    const create = vi.fn().mockResolvedValue({ id: 'app-1', status: ApplicationStatus.SUBMITTED });
    const prisma = {
      academicSession: {
        findFirst: vi.fn().mockResolvedValue({ id: 'session-1', name: '2025/2026' }),
      },
      class: {
        findFirst: vi.fn().mockResolvedValue({ id: 'class-1', name: 'JSS 1' }),
      },
      admissionApplication: {
        create,
      },
      $transaction: vi.fn(async (callback: (tx: any) => Promise<unknown>) => callback({
        numberSequence: {
          upsert: vi.fn().mockResolvedValue({ nextValue: 2 }),
        },
        admissionApplication: {
          create,
        },
      })),
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

    expect(create).toHaveBeenCalledWith(
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

  it('rejects invalid review status jumps', async () => {
    const prisma = {
      admissionApplication: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'app-1',
          status: ApplicationStatus.SUBMITTED,
          notes: null,
          student: null,
        }),
      },
    } as any;
    const service = new AdmissionsService(prisma);

    await expect(service.reviewApplication('app-1', {
      status: ApplicationStatus.APPROVED,
    })).rejects.toThrow('Cannot review application from SUBMITTED to APPROVED');
  });

  it('stores an interview outcome when advancing an application', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'app-1', status: ApplicationStatus.APPROVED });
    const prisma = {
      admissionApplication: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'app-1',
          status: ApplicationStatus.INTERVIEW_SCHEDULED,
          notes: null,
          student: null,
        }),
        update,
      },
      auditLog: { create: vi.fn().mockResolvedValue({}) },
    } as any;
    const service = new AdmissionsService(prisma);

    await service.advanceApplication('app-1', {
      status: ApplicationStatus.APPROVED,
      interviewOutcome: 'Recommended for admission',
    }, 'reviewer-1');

    expect(update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ interviewOutcome: 'Recommended for admission' }),
    }));
  });

  it('returns offer details only for approved applications', async () => {
    const prisma = {
      admissionApplication: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'app-1',
          applicationNo: 'APP260001',
          status: ApplicationStatus.APPROVED,
          firstName: 'Ada',
          middleName: null,
          lastName: 'Okafor',
          parentName: 'Grace Okafor',
          parentEmail: 'grace@example.com',
          parentPhone: '08000000000',
          applyingClass: 'JSS 1',
          interviewDate: null,
          interviewOutcome: 'Recommended',
          offerSentAt: null,
          offerExpiresAt: new Date('2026-10-01T00:00:00.000Z'),
          acceptedAt: null,
          student: null,
        }),
      },
    } as any;
    const service = new AdmissionsService(prisma);

    await expect(service.getOfferDetails('app-1')).resolves.toMatchObject({
      applicationNo: 'APP260001',
      applicant: { firstName: 'Ada', lastName: 'Okafor' },
      applyingClass: 'JSS 1',
      interviewOutcome: 'Recommended',
    });
  });

  it('requires an expiry date when sending an admission offer', async () => {
    const prisma = {
      admissionApplication: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'app-1',
          status: ApplicationStatus.APPROVED,
          notes: null,
          student: null,
        }),
      },
    } as any;
    const service = new AdmissionsService(prisma);

    await expect(service.advanceApplication('app-1', {
      status: ApplicationStatus.OFFER_SENT,
    })).rejects.toThrow('Offer expiry date is required');
  });

  it('returns the application audit timeline in chronological order', async () => {
    const timeline = [{ id: 'log-1', action: 'ADMISSION_REVIEW' }];
    const prisma = {
      admissionApplication: {
        findUnique: vi.fn().mockResolvedValue({ id: 'app-1', student: null }),
      },
      auditLog: { findMany: vi.fn().mockResolvedValue(timeline) },
    } as any;
    const service = new AdmissionsService(prisma);

    await expect(service.getApplicationTimeline('app-1')).resolves.toEqual(timeline);
    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { entity: 'AdmissionApplication', entityId: 'app-1' },
      orderBy: { createdAt: 'asc' },
    }));
  });
});
