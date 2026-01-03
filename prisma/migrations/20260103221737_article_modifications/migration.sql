/*
  Warnings:

  - You are about to drop the column `categoryArticleId` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `photoPublicId` on the `article` table. All the data in the column will be lost.
  - You are about to drop the `categoryArticle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AcademicService" DROP CONSTRAINT "AcademicService_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "article" DROP CONSTRAINT "article_categoryArticleId_fkey";

-- DropForeignKey
ALTER TABLE "library" DROP CONSTRAINT "library_categoryLibraryId_fkey";

-- AlterTable
ALTER TABLE "AcademicService" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "article" DROP COLUMN "categoryArticleId",
DROP COLUMN "photoPublicId";

-- AlterTable
ALTER TABLE "library" ALTER COLUMN "categoryLibraryId" DROP NOT NULL;

-- DropTable
DROP TABLE "categoryArticle";

-- CreateTable
CREATE TABLE "ResearchAbstract" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "ResearchType" TEXT NOT NULL,
    "subTitle" TEXT,
    "author" TEXT,
    "degree" TEXT,
    "content" TEXT NOT NULL,
    "university" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchAbstract_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AcademicService" ADD CONSTRAINT "AcademicService_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AcademicCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library" ADD CONSTRAINT "library_categoryLibraryId_fkey" FOREIGN KEY ("categoryLibraryId") REFERENCES "categoryLibrary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
