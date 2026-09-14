CREATE TYPE "FeePlanStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

CREATE TABLE "StudentFeePlan" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "termId" TEXT,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "FeePlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StudentFeePlan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentFeePlanItem" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "feeStructureId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    CONSTRAINT "StudentFeePlanItem_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "FeeInvoice" ADD COLUMN "feePlanId" TEXT;
CREATE UNIQUE INDEX "StudentFeePlanItem_planId_feeStructureId_key" ON "StudentFeePlanItem"("planId", "feeStructureId");
CREATE INDEX "StudentFeePlan_studentId_sessionId_termId_idx" ON "StudentFeePlan"("studentId", "sessionId", "termId");
ALTER TABLE "StudentFeePlan" ADD CONSTRAINT "StudentFeePlan_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StudentFeePlanItem" ADD CONSTRAINT "StudentFeePlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "StudentFeePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentFeePlanItem" ADD CONSTRAINT "StudentFeePlanItem_feeStructureId_fkey" FOREIGN KEY ("feeStructureId") REFERENCES "FeeStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FeeInvoice" ADD CONSTRAINT "FeeInvoice_feePlanId_fkey" FOREIGN KEY ("feePlanId") REFERENCES "StudentFeePlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;