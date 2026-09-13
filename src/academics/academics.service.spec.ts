import { describe, expect, it, vi } from 'vitest';
import { AcademicsService } from './academics.service.js';

const timetableDto = {
  sessionId: 'session-1',
  classId: 'class-1',
  subjectId: 'subject-1',
  teacherId: 'teacher-1',
  dayOfWeek: 1,
  startTime: '08:00',
  endTime: '09:00',
};

function createPrisma(overrides: Record<string, unknown> = {}) {
  return {
    academicSession: { findUnique: vi.fn().mockResolvedValue({ id: 'session-1' }) },
    class: { findUnique: vi.fn().mockResolvedValue({ id: 'class-1', sessionId: 'session-1' }) },
    subject: { findUnique: vi.fn().mockResolvedValue({ id: 'subject-1' }) },
    staff: { findUnique: vi.fn().mockResolvedValue({ id: 'teacher-1' }) },
    timetableEntry: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({ id: 'entry-1' }),
      ...overrides,
    },
  } as any;
}

describe('AcademicsService timetable', () => {
  it('rejects periods whose end is not after their start', async () => {
    const service = new AcademicsService(createPrisma());

    await expect(
      service.createTimetableEntry({ ...timetableDto, endTime: '08:00' } as any),
    ).rejects.toThrow('End time must be after start time');
  });

  it('rejects a teacher clash', async () => {
    const prisma = createPrisma({
      findMany: vi.fn().mockResolvedValue([
        { classId: 'class-2', teacherId: 'teacher-1', startTime: '08:30', endTime: '09:30', room: null },
      ]),
    });
    const service = new AcademicsService(prisma);

    await expect(service.createTimetableEntry(timetableDto as any)).rejects.toThrow(
      'This teacher is already scheduled',
    );
  });

  it('rejects a room clash', async () => {
    const prisma = createPrisma({
      findMany: vi.fn().mockResolvedValue([
        { classId: 'class-2', teacherId: 'teacher-2', startTime: '08:30', endTime: '09:30', room: 'Room A' },
      ]),
    });
    const service = new AcademicsService(prisma);

    await expect(
      service.createTimetableEntry({ ...timetableDto, room: 'room a' } as any),
    ).rejects.toThrow('This room is already booked');
  });
});