CREATE TABLE "NumberSequence" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nextValue" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NumberSequence_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NumberSequence_name_key" ON "NumberSequence"("name");

INSERT INTO "NumberSequence" ("id", "name", "nextValue", "updatedAt")
VALUES
  ('finance-invoice-sequence', 'invoice', 1, CURRENT_TIMESTAMP),
  ('finance-receipt-sequence', 'receipt', 1, CURRENT_TIMESTAMP);

UPDATE "NumberSequence"
SET "nextValue" = COALESCE((
  SELECT MAX(CAST(SUBSTRING("invoiceNumber" FROM 6) AS INTEGER)) + 1
  FROM "FeeInvoice"
  WHERE "invoiceNumber" ~ '^INV[0-9]{2}[0-9]+$'
), 1)
WHERE "name" = 'invoice';

UPDATE "NumberSequence"
SET "nextValue" = COALESCE((
  SELECT MAX(CAST(SUBSTRING("receiptNumber" FROM 7) AS INTEGER)) + 1
  FROM "Payment"
  WHERE "receiptNumber" ~ '^RCPT[0-9]{2}[0-9]+$'
), 1)
WHERE "name" = 'receipt';