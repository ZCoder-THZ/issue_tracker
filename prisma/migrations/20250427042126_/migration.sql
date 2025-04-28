/*
  Warnings:

  - Added the required column `senderId` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "senderId" TEXT NOT NULL,
ALTER COLUMN "issueId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "notifications_senderId_idx" ON "notifications"("senderId");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
