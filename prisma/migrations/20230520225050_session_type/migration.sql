-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('WEB', 'GAME');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "type" "SessionType" DEFAULT 'WEB';
