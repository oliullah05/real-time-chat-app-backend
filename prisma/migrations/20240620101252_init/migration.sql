/*
  Warnings:

  - The `lastMessageType` column on the `conversations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('web', 'code', 'video', 'audio', 'image', 'document', 'archive', 'text');

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "lastMessageType",
ADD COLUMN     "lastMessageType" "MessageType" NOT NULL DEFAULT 'text';

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "type",
ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'text';
