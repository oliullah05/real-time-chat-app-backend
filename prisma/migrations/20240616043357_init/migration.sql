/*
  Warnings:

  - You are about to drop the column `participants` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `receiver` on the `messages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_receiver_fkey";

-- DropIndex
DROP INDEX "conversations_participants_key";

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "participants";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "receiver",
ALTER COLUMN "type" SET DEFAULT 'text';
