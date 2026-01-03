-- Handle duplicate emails in Instructor table before adding unique constraint
-- Set duplicate emails (except the first occurrence) to NULL
DO $$
DECLARE
    dup_record RECORD;
    instructor_id TEXT;
    counter INTEGER;
BEGIN
    -- Find and handle duplicate emails
    FOR dup_record IN 
        SELECT email, array_agg(id ORDER BY "createdAt") as ids
        FROM "Instructor"
        WHERE email IS NOT NULL
        GROUP BY email
        HAVING COUNT(*) > 1
    LOOP
        -- Keep the first email, set others to NULL
        counter := 1;
        FOREACH instructor_id IN ARRAY dup_record.ids
        LOOP
            IF counter > 1 THEN
                UPDATE "Instructor"
                SET email = NULL
                WHERE id = instructor_id;
            END IF;
            counter := counter + 1;
        END LOOP;
    END LOOP;
END $$;

-- Add new course fields
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "courseBenefits" TEXT;
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "wayOfTraining" TEXT;
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "targetAudience" TEXT;

-- Add unique constraint on Instructor email if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'Instructor_email_key'
    ) THEN
        CREATE UNIQUE INDEX "Instructor_email_key" ON "Instructor"("email") WHERE "email" IS NOT NULL;
    END IF;
END $$;

