-- CreateEnum
CREATE TYPE "ModerationType" AS ENUM ('NAME', 'WARN', 'BAN');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MOD';

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Moderation" (
    "id" SERIAL NOT NULL,
    "type" "ModerationType" NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'No reason provided',
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "dateResolved" TIMESTAMP(3),
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Moderation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Moderation_id_key" ON "Moderation"("id");

-- AddForeignKey
ALTER TABLE "Moderation" ADD CONSTRAINT "Moderation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
