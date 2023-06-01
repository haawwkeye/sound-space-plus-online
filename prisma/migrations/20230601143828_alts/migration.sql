-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "invalid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registerIp" TEXT;

-- CreateTable
CREATE TABLE "Alt" (
    "id" TEXT NOT NULL,
    "matches" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "lastMatched" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alt_id_key" ON "Alt"("id");

-- AddForeignKey
ALTER TABLE "Alt" ADD CONSTRAINT "Alt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alt" ADD CONSTRAINT "Alt_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
