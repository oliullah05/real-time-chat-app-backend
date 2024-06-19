/*
  Warnings:

  - You are about to drop the column `messageType` on the `conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "messageType",
ADD COLUMN     "lastMessageType" TEXT DEFAULT 'text';
