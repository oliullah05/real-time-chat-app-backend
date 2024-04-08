/*
  Warnings:

  - You are about to drop the column `message` on the `conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "message",
ADD COLUMN     "lastMessage" TEXT NOT NULL DEFAULT 'no msg';
