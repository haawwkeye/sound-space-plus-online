/*
  Warnings:

  - Added the required column `adminId` to the `Moderation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Moderation" ADD COLUMN     "adminId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Moderation" ADD CONSTRAINT "Moderation_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
