import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAssessmentDto } from './dto/create-assessment.dto.js';
import { UpdateAssessmentDto } from './dto/update-assessment.dto.js';
import { RecordScoreDto } from './dto/record-score.dto.js';
import { BulkRecordScoresDto } from './dto/bulk-record-scores.dto.js';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  private calculateGrade(score: number | null, maxScore: number) {
    if (score === null || maxScore <= 0) {
      return { percentage: null, grade: null, remark: null };
    }

    const percentage = Number(((score / maxScore) * 100).toFixed(2));
    const band = percentage >= 75
      ? { grade: 'A', remark: 'Excellent' }
      : percentage >= 65
        ? { grade: 'B', remark: 'Very Good' }
        : percentage >= 55
          ? { grade: 'C', remark: 'Good' }
          : percentage >= 45
            ? { grade: 'D', remark: 'Pass' }
            : percentage >= 40
              ? { grade: 'E', remark: 'Weak Pass' }
              : { grade: 'F', remark: 'Fail' };

    return { percentage, ...band };
  }

  private async assertTeacherCanAccessSubject(
    currentUser: any,
    subjectId?: string,
    classId?: string,
  ) {
    if (!currentUser || currentUser.role !== 'TEACHER') {
      return;
    }

    const staff = await this.prisma.staff.findFirst({
      where: { userId: currentUser.id },
    });

    if (!staff) {
      throw new ForbiddenException('Teacher profile not found');
    }

    const assignment = await this.prisma.classSubject.findFirst({
      where: {
        teacherId: staff.id,
        ...(subjectId ? { subjectId } : {}),
        ...(classId ? { classId } : {}),
      },
    });

    if (!assignment) {
      throw new ForbiddenException(
        'You are not assigned to this subject/class for this operation',
      );
    }
  }

  // ======================
  // ASSESSMENTS
  // ======================

  async createAssessment(dto: CreateAssessmentDto, currentUser?: any) {
    await this.assertTeacherCanAccessSubject(currentUser, dto.subjectId);
    if (dto.weight !== undefined && (dto.weight < 0 || dto.weight > 100)) {
      throw new BadRequestException('Assessment weight must be between 0 and 100');
    }
    const term = await this.prisma.term.findUnique({
      where: { id: dto.termId },
    });
    if (!term) throw new NotFoundException('Term not found');

    const subject = await this.prisma.subject.findUnique({
      where: { id: dto.subjectId },
    });
    if (!subject) throw new NotFoundException('Subject not found');

    const existingWeight = await this.prisma.assessment.aggregate({
      where: { termId: dto.termId, subjectId: dto.subjectId },
      _sum: { weight: true },
    });
    if ((existingWeight._sum.weight ?? 0) + (dto.weight ?? 0) > 100) {
      throw new BadRequestException('Assessment weights for a subject and term cannot exceed 100');
    }

    return this.prisma.assessment.create({
      data: {
        termId: dto.termId,
        subjectId: dto.subjectId,
        name: dto.name,
        maxScore: dto.maxScore,
        weight: dto.weight,
        assessmentDate: dto.assessmentDate
          ? new Date(dto.assessmentDate)
          : null,
      },
      include: {
        term: true,
        subject: true,
      },
    });
  }

  async getAssessments(termId?: string, subjectId?: string, currentUser?: any) {
    if (currentUser?.role === 'TEACHER') {
      await this.assertTeacherCanAccessSubject(currentUser, subjectId);
    }

    return this.prisma.assessment.findMany({
      where: {
        ...(termId && { termId }),
        ...(subjectId && { subjectId }),
      },
      include: {
        term: true,
        subject: true,
        _count: { select: { scores: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAssessment(id: string, currentUser?: any) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        term: true,
        subject: true,
        scores: {
          include: {
            student: {
              select: {
                id: true,
                admissionNumber: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    if (currentUser?.role === 'TEACHER') {
      await this.assertTeacherCanAccessSubject(currentUser, assessment.subjectId);
    }

    return assessment;
  }

  async updateAssessment(id: string, dto: UpdateAssessmentDto, currentUser?: any) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    if (currentUser?.role === 'TEACHER') {
      await this.assertTeacherCanAccessSubject(currentUser, assessment.subjectId);
    }

    if (dto.termId) {
      const term = await this.prisma.term.findUnique({
        where: { id: dto.termId },
      });
      if (!term) throw new NotFoundException('Term not found');
    }

    if (dto.subjectId) {
      const subject = await this.prisma.subject.findUnique({
        where: { id: dto.subjectId },
      });
      if (!subject) throw new NotFoundException('Subject not found');
    }

    if (dto.maxScore !== undefined && dto.maxScore < 1) {
      throw new BadRequestException('Max score must be at least 1');
    }

    if (dto.weight !== undefined && (dto.weight < 0 || dto.weight > 100)) {
      throw new BadRequestException('Assessment weight must be between 0 and 100');
    }

    if (dto.weight !== undefined || dto.termId || dto.subjectId) {
      const termId = dto.termId ?? assessment.termId;
      const subjectId = dto.subjectId ?? assessment.subjectId;
      const existingWeight = await this.prisma.assessment.aggregate({
        where: { termId, subjectId, id: { not: id } },
        _sum: { weight: true },
      });
      if ((existingWeight._sum.weight ?? 0) + (dto.weight ?? assessment.weight ?? 0) > 100) {
        throw new BadRequestException('Assessment weights for a subject and term cannot exceed 100');
      }
    }

    return this.prisma.assessment.update({
      where: { id },
      data: {
        termId: dto.termId,
        subjectId: dto.subjectId,
        name: dto.name,
        maxScore: dto.maxScore,
        weight: dto.weight,
        assessmentDate: dto.assessmentDate
          ? new Date(dto.assessmentDate)
          : undefined,
      },
      include: {
        term: true,
        subject: true,
      },
    });
  }

  async deleteAssessment(id: string, currentUser?: any) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    if (currentUser?.role === 'TEACHER') {
      await this.assertTeacherCanAccessSubject(currentUser, assessment.subjectId);
    }

    await this.prisma.studentAssessment.deleteMany({
      where: { assessmentId: id },
    });

    return this.prisma.assessment.delete({
      where: { id },
    });
  }

  // ======================
  // RECORD SCORES
  // ======================

  async recordScore(dto: RecordScoreDto, currentUser?: any) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: dto.assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    if (currentUser?.role === 'TEACHER') {
      await this.assertTeacherCanAccessSubject(currentUser, assessment.subjectId);
    }

    if (currentUser?.role === 'TEACHER') {
      await this.assertTeacherCanAccessSubject(currentUser, assessment.subjectId);
    }

    if (dto.score > assessment.maxScore) {
      throw new BadRequestException(
        `Score cannot be higher than max score (${assessment.maxScore})`,
      );
    }

    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.studentAssessment.upsert({
      where: {
        studentId_assessmentId: {
          studentId: dto.studentId,
          assessmentId: dto.assessmentId,
        },
      },
      update: {
        score: dto.score,
        remark: dto.remark,
      },
      create: {
        studentId: dto.studentId,
        assessmentId: dto.assessmentId,
        score: dto.score,
        remark: dto.remark,
      },
      include: {
        student: {
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            lastName: true,
          },
        },
        assessment: true,
      },
    });
  }

  async bulkRecordScores(dto: BulkRecordScoresDto, currentUser?: any) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: dto.assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const results = [];

    for (const item of dto.scores) {
      if (item.score > assessment.maxScore) {
        throw new BadRequestException(
          `Score for student ${item.studentId} exceeds max score`,
        );
      }

      const record = await this.prisma.studentAssessment.upsert({
        where: {
          studentId_assessmentId: {
            studentId: item.studentId,
            assessmentId: dto.assessmentId,
          },
        },
        update: {
          score: item.score,
          remark: item.remark,
        },
        create: {
          studentId: item.studentId,
          assessmentId: dto.assessmentId,
          score: item.score,
          remark: item.remark,
        },
      });

      results.push(record);
    }

    return {
      message: `${results.length} scores recorded successfully`,
      count: results.length,
    };
  }

  // ======================
  // STUDENT RESULTS
  // ======================

  async getStudentResults(studentId: string, termId?: string, currentUser?: any) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (currentUser?.role === 'TEACHER') {
      await this.assertTeacherCanAccessSubject(currentUser, undefined, student.currentClassId ?? undefined);
    }

    const scores = await this.prisma.studentAssessment.findMany({
      where: {
        studentId,
        ...(termId && {
          assessment: { termId },
        }),
      },
      include: {
        assessment: {
          include: {
            subject: true,
            term: true,
          },
        },
      },
      orderBy: {
        assessment: {
          subject: { name: 'asc' },
        },
      },
    });

    return {
      student: {
        id: student.id,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
      },
      scores: scores.map((score) => ({
        ...score,
        grading: {
          ...this.calculateGrade(score.score, score.assessment.maxScore),
          weightedContribution: score.score === null || !score.assessment.weight
            ? null
            : Number((((score.score / score.assessment.maxScore) * score.assessment.weight)).toFixed(2)),
        },
      })),
    };
  }

  async getClassResults(classId: string, assessmentId: string, currentUser?: any) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { subject: true, term: true },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    if (currentUser?.role === 'TEACHER') {
      await this.assertTeacherCanAccessSubject(currentUser, assessment.subjectId, classId);
    }

    const students = await this.prisma.student.findMany({
      where: {
        currentClassId: classId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        admissionNumber: true,
        firstName: true,
        lastName: true,
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });

    const scores = await this.prisma.studentAssessment.findMany({
      where: {
        assessmentId,
        studentId: { in: students.map((s) => s.id) },
      },
    });

    const scoreMap = new Map(scores.map((s) => [s.studentId, s]));

    const results = students.map((student) => {
      const scoreRecord = scoreMap.get(student.id);
      return {
        student,
        score: scoreRecord?.score ?? null,
        remark: scoreRecord?.remark ?? null,
        grading: this.calculateGrade(scoreRecord?.score ?? null, assessment.maxScore),
      };
    });

    return {
      assessment,
      results,
    };
  }
}