-- AlterTable: Add updatedAt column to AcademicCategory
-- First, add the column as nullable
ALTER TABLE "AcademicCategory" ADD COLUMN "updatedAt" TIMESTAMP(3);

-- Set updatedAt to createdAt (or current timestamp) for existing rows
UPDATE "AcademicCategory" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;

-- Now make it NOT NULL with a default value
ALTER TABLE "AcademicCategory" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "AcademicCategory" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: Add updatedAt column to AcademicService
-- First, add the column as nullable
ALTER TABLE "AcademicService" ADD COLUMN "updatedAt" TIMESTAMP(3);

-- Set updatedAt to createdAt (or current timestamp) for existing rows
UPDATE "AcademicService" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;

-- Now make it NOT NULL with a default value
ALTER TABLE "AcademicService" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "AcademicService" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
