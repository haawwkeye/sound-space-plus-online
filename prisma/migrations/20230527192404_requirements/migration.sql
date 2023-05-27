/*
  Warnings:

  - Made the column `cookie` on table `Session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastAccessed` on table `Session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `Session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userAgent` on table `Session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `verified` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "cookie" SET NOT NULL,
ALTER COLUMN "lastAccessed" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "userAgent" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verified" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL;
