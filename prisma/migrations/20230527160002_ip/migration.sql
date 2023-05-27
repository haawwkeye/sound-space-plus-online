/*
  Warnings:

  - You are about to drop the column `ips` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userAgents` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "ips",
DROP COLUMN "userAgents",
ADD COLUMN     "ip" TEXT,
ADD COLUMN     "userAgent" TEXT;
