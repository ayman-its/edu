/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Instructor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `photoPublicId` to the `Instructor` table without a default value. This is not possible if the table is not empty.
  - Made the column `photoUrl` on table `Instructor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AcademicCategory" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "AcademicService" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "photoPublicId" TEXT,
ALTER COLUMN "coursePhotoUrl" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "discount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "photoPublicId" TEXT;
-- Note: photoUrl remains nullable to match schema

-- CreateTable
CREATE TABLE "library" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "photoPublicId" TEXT,
    "categoryLibraryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoryLibrary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categoryLibrary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoryArticle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categoryArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "photoPublicId" TEXT,
    "categoryArticleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'Instructor_email_key'
    ) THEN
        CREATE UNIQUE INDEX "Instructor_email_key" ON "Instructor"("email");
    END IF;
END $$;

-- AddForeignKey
ALTER TABLE "library" ADD CONSTRAINT "library_categoryLibraryId_fkey" FOREIGN KEY ("categoryLibraryId") REFERENCES "categoryLibrary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_categoryArticleId_fkey" FOREIGN KEY ("categoryArticleId") REFERENCES "categoryArticle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Course" ALTER COLUMN "coursePhotoUrl" DROP NOT NULL;
ALTER TABLE "Course" ALTER COLUMN "photoPublicId" DROP NOT NULL;