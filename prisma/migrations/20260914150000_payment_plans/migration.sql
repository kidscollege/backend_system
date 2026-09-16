CREATE TYPE "PaymentPlanStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE "InstallmentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');
CREATE TYPE "FeeAdjustmentType" AS ENUM ('SCHOLARSHIP', 'WAIVER');

CREATE TABLE "PaymentPlan" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "installmentCount" INTEGER NOT NULL,
    "status" "PaymentPlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PaymentPlan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Installment" (
    "id" TEXT NOT NULL,
    "paymentPlanId" TEXT NOT NULL,
    "installmentNo" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "InstallmentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Installment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PaymentPlan_invoiceId_key" ON "PaymentPlan"("invoiceId");
CREATE UNIQUE INDEX "Installment_paymentPlanId_installmentNo_key" ON "Installment"("paymentPlanId", "installmentNo");
CREATE INDEX "Installment_dueDate_status_idx" ON "Installment"("dueDate", "status");
ALTER TABLE "PaymentPlan" ADD CONSTRAINT "PaymentPlan_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "FeeInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_paymentPlanId_fkey" FOREIGN KEY ("paymentPlanId") REFERENCES "PaymentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "InstallmentPaymentAllocation" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "installmentId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InstallmentPaymentAllocation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InstallmentPaymentAllocation_paymentId_installmentId_key" ON "InstallmentPaymentAllocation"("paymentId", "installmentId");
CREATE INDEX "InstallmentPaymentAllocation_installmentId_idx" ON "InstallmentPaymentAllocation"("installmentId");
ALTER TABLE "InstallmentPaymentAllocation" ADD CONSTRAINT "InstallmentPaymentAllocation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InstallmentPaymentAllocation" ADD CONSTRAINT "InstallmentPaymentAllocation_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "StudentFeePlanAdjustment" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "type" "FeeAdjustmentType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "approvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentFeePlanAdjustment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StudentFeePlanAdjustment_planId_type_idx" ON "StudentFeePlanAdjustment"("planId", "type");
ALTER TABLE "StudentFeePlanAdjustment" ADD CONSTRAINT "StudentFeePlanAdjustment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "StudentFeePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;