-- CreateTable
CREATE TABLE IF NOT EXISTS "Instructor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "bio" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Instructor_email_key" ON "Instructor"("email") WHERE "email" IS NOT NULL;

-- Create a default instructor for existing data (using cuid-like format)
INSERT INTO "Instructor" ("id", "name", "email", "createdAt", "updatedAt")
SELECT 
    'clx' || substr(md5(random()::text || clock_timestamp()::text), 1, 21),
    'Default Instructor',
    'default@example.com',
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Instructor" WHERE "email" = 'default@example.com');

-- Add instructorId to CourseGroup as nullable first
ALTER TABLE "CourseGroup" ADD COLUMN IF NOT EXISTS "instructorId" TEXT;

-- Add instructorId to Course as nullable first  
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "instructorId" TEXT;

-- Update existing records with default instructor
UPDATE "CourseGroup" 
SET "instructorId" = (SELECT "id" FROM "Instructor" WHERE "email" = 'default@example.com' LIMIT 1)
WHERE "instructorId" IS NULL;

UPDATE "Course" 
SET "instructorId" = (SELECT "id" FROM "Instructor" WHERE "email" = 'default@example.com' LIMIT 1)
WHERE "instructorId" IS NULL;

-- Drop old instructor column from Course if it exists (text type)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Course' AND column_name = 'instructor' AND data_type = 'text'
    ) THEN
        ALTER TABLE "Course" DROP COLUMN "instructor";
    END IF;
END $$;

-- Make instructorId NOT NULL after populating
ALTER TABLE "CourseGroup" ALTER COLUMN "instructorId" SET NOT NULL;
ALTER TABLE "Course" ALTER COLUMN "instructorId" SET NOT NULL;

-- Add foreign keys
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'CourseGroup_instructorId_fkey' AND table_name = 'CourseGroup'
    ) THEN
        ALTER TABLE "CourseGroup" ADD CONSTRAINT "CourseGroup_instructorId_fkey" 
        FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Course_instructorId_fkey' AND table_name = 'Course'
    ) THEN
        ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" 
        FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

