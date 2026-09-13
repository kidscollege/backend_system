-- Extend the admissions workflow without changing existing application data.
ALTER TYPE "ApplicationStatus" ADD VALUE 'INTERVIEW_SCHEDULED';
ALTER TYPE "ApplicationStatus" ADD VALUE 'OFFER_SENT';
ALTER TYPE "ApplicationStatus" ADD VALUE 'ACCEPTED';

ALTER TABLE "AdmissionApplication"
  ADD COLUMN "interviewDate" TIMESTAMP(3),
  ADD COLUMN "offerSentAt" TIMESTAMP(3),
  ADD COLUMN "acceptedAt" TIMESTAMP(3);