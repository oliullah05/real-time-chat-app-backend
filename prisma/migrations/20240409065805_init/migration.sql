/*
  Warnings:

  - Added the required column `receiver` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "receiver" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
