import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAssessmentDto } from './dto/create-assessment.dto.js';
import { RecordScoreDto } from './dto/record-score.dto.js';
import { BulkRecordScoresDto } from './dto/bulk-record-scores.dto.js';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  // ======================
  // ASSESSMENTS
  // ======================

  async createAssessment(dto: CreateAssessmentDto) {
    const term = await this.prisma.term.findUnique({
      where: { id: dto.termId },
    });
    if (!term) throw new NotFoundException('Term not found');

    const subject = await this.prisma.subject.findUnique({
      where: { id: dto.subjectId },
    });
    if (!subject) throw new NotFoundException('Subject not found');

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

  async getAssessments(termId?: string, subjectId?: string) {
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

  async getAssessment(id: string) {
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

    return assessment;
  }

  // ======================
  // RECORD SCORES
  // ======================

  async recordScore(dto: RecordScoreDto) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: dto.assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
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

  async bulkRecordScores(dto: BulkRecordScoresDto) {
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

  async getStudentResults(studentId: string, termId?: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
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
      scores,
    };
  }

  async getClassResults(classId: string, assessmentId: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { subject: true, term: true },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
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
      };
    });

    return {
      assessment,
      results,
    };
  }
}