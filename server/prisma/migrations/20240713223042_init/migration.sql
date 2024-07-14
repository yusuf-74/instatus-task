/*
  Warnings:

  - You are about to drop the column `targetName` on the `Events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "targetName";

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
