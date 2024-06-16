/*
  Warnings:

  - The primary key for the `conversations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "conversationUsers" DROP CONSTRAINT "conversationUsers_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "conversationUsers" DROP CONSTRAINT "conversationUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_fkey";

-- AlterTable
ALTER TABLE "conversationUsers" ALTER COLUMN "conversationId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "conversations_id_seq";

-- AlterTable
ALTER TABLE "messages" DROP CONSTRAINT "messages_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "conversationId" SET DATA TYPE TEXT,
ALTER COLUMN "sender" SET DATA TYPE TEXT,
ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "messages_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "conversationUsers" ADD CONSTRAINT "conversationUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversationUsers" ADD CONSTRAINT "conversationUsers_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
