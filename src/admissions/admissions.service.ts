import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { ReviewApplicationDto } from './dto/review-application.dto.js';
import { ApplicationStatus, Role, StudentStatus } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdmissionsService {
  constructor(private prisma: PrismaService) {}

  private async generateApplicationNumber(): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await this.prisma.admissionApplication.count();
    const next = (count + 1).toString().padStart(4, '0');
    return `APP${year}${next}`; // e.g. APP260001
  }

  async createApplication(dto: CreateApplicationDto) {
    const applicationNo = await this.generateApplicationNumber();

    return this.prisma.admissionApplication.create({
      data: {
        applicationNo,
        firstName: dto.firstName,
        lastName: dto.lastName,
        middleName: dto.middleName,
        gender: dto.gender,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        applyingClass: dto.applyingClass,
        parentName: dto.parentName,
        parentPhone: dto.parentPhone,
        parentEmail: dto.parentEmail,
        notes: dto.notes,
        status: ApplicationStatus.SUBMITTED,
      },
    });
  }

  async findAll(status?: ApplicationStatus) {
    return this.prisma.admissionApplication.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.admissionApplication.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async reviewApplication(
    id: string,
    dto: ReviewApplicationDto,
    reviewedById?: string,
  ) {
    const application = await this.findOne(id);

    if (dto.status === ApplicationStatus.ADMITTED) {
      throw new BadRequestException(
        'Use the admission action to convert an approved application into a student',
      );
    }

    if (
      application.status === ApplicationStatus.ADMITTED ||
      application.status === ApplicationStatus.REJECTED
    ) {
      throw new BadRequestException(
        `Application is already ${application.status}`,
      );
    }

    return this.prisma.admissionApplication.update({
      where: { id },
      data: {
        status: dto.status,
        notes: dto.notes ?? application.notes,
        reviewedById,
        reviewedAt: new Date(),
      },
    });
  }

  /**
   * Admit an approved application → creates a real Student record
   */
  async admitApplication(id: string, reviewedById?: string) {
    const application = await this.findOne(id);

    if (application.status === ApplicationStatus.ADMITTED) {
      throw new BadRequestException('Application is already admitted');
    }

    if (application.status === ApplicationStatus.REJECTED) {
      throw new BadRequestException('Cannot admit a rejected application');
    }

    if (application.status !== ApplicationStatus.APPROVED) {
      throw new BadRequestException(
        'Only approved applications can be admitted',
      );
    }

    // Generate admission number
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await this.prisma.student.count();
    const next = (count + 1).toString().padStart(4, '0');
    const admissionNumber = `ADM${year}${next}`;

    const result = await this.prisma.$transaction(async (tx) => {
      // Create Student
      const student = await tx.student.create({
        data: {
          admissionNumber,
          firstName: application.firstName,
          lastName: application.lastName,
          middleName: application.middleName,
          gender: application.gender,
          dateOfBirth: application.dateOfBirth,
          status: StudentStatus.ACTIVE,
          admissionDate: new Date(),
        },
      });

      let parentAccount: {
        email: string;
        temporaryPassword?: string;
        created: boolean;
      } | null = null;

      // Create or link a parent identity when contact email is available.
      if (application.parentName) {
        const nameParts = application.parentName.trim().split(' ');
        const parentFirstName = nameParts[0] || 'Parent';
        const parentLastName = nameParts.slice(1).join(' ') || 'Guardian';
        const parentEmail = application.parentEmail?.trim().toLowerCase();
        let parentUserId: string | undefined;

        if (parentEmail) {
          const existingUser = await tx.user.findUnique({
            where: { email: parentEmail },
          });

          if (existingUser && existingUser.role !== Role.PARENT) {
            throw new BadRequestException(
              'The parent email is already used by another account',
            );
          }

          if (existingUser) {
            parentUserId = existingUser.id;
          } else {
            const temporaryPassword = randomBytes(9).toString('base64url');
            const passwordHash = await bcrypt.hash(temporaryPassword, 10);
            const parentUser = await tx.user.create({
              data: {
                email: parentEmail,
                passwordHash,
                firstName: parentFirstName,
                lastName: parentLastName,
                phone: application.parentPhone,
                role: Role.PARENT,
              },
            });
            parentUserId = parentUser.id;
            parentAccount = {
              email: parentEmail,
              temporaryPassword,
              created: true,
            };
          }
        }

        const existingParent = parentEmail
          ? await tx.parent.findFirst({ where: { email: parentEmail } })
          : null;

        const parent = existingParent
          ? await tx.parent.update({
              where: { id: existingParent.id },
              data: { userId: existingParent.userId ?? parentUserId },
            })
          : await tx.parent.create({
              data: {
                userId: parentUserId,
                firstName: parentFirstName,
                lastName: parentLastName,
                phone: application.parentPhone,
                email: parentEmail,
              },
            });

        if (!parentAccount && parentUserId) {
          parentAccount = {
            email: parentEmail!,
            created: false,
          };
        }

        await tx.studentGuardian.create({
          data: {
            studentId: student.id,
            parentId: parent.id,
            relationship: 'Guardian',
            isPrimary: true,
          },
        });
      }

      // Update application
      const updatedApplication = await tx.admissionApplication.update({
        where: { id },
        data: {
          status: ApplicationStatus.ADMITTED,
          studentId: student.id,
          reviewedById,
          reviewedAt: new Date(),
        },
        include: {
          student: true,
        },
      });

      return { application: updatedApplication, parentAccount };
    });

    return result;
  }


  async trackApplication(applicationNo: string, phone?: string, email?: string) {
  if (!applicationNo) {
    throw new BadRequestException('Application number is required');
  }

  if (!phone && !email) {
    throw new BadRequestException('Phone or email is required');
  }

  const application = await this.prisma.admissionApplication.findFirst({
    where: {
      applicationNo,
      OR: [
        ...(phone ? [{ parentPhone: phone }] : []),
        ...(email ? [{ parentEmail: email }] : []),
      ],
    },
    select: {
      applicationNo: true,
      firstName: true,
      lastName: true,
      middleName: true,
      applyingClass: true,
      status: true,
      createdAt: true,
      parentName: true,
    },
  });

  if (!application) {
    throw new NotFoundException('Application not found. Check your details.');
  }

  return application;
}

  

  async getStats() {
    const [total, submitted, underReview, approved, rejected, admitted] =
      await Promise.all([
        this.prisma.admissionApplication.count(),
        this.prisma.admissionApplication.count({
          where: { status: ApplicationStatus.SUBMITTED },
        }),
        this.prisma.admissionApplication.count({
          where: { status: ApplicationStatus.UNDER_REVIEW },
        }),
        this.prisma.admissionApplication.count({
          where: { status: ApplicationStatus.APPROVED },
        }),
        this.prisma.admissionApplication.count({
          where: { status: ApplicationStatus.REJECTED },
        }),
        this.prisma.admissionApplication.count({
          where: { status: ApplicationStatus.ADMITTED },
        }),
      ]);

    return {
      total,
      submitted,
      underReview,
      approved,
      rejected,
      admitted,
    };
  }
}