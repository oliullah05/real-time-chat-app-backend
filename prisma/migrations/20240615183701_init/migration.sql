/*
  Warnings:

  - The primary key for the `conversationUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `conversationUsers` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `conversationUsers` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `conversationUsers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,conversationId]` on the table `conversationUsers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `conversationUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "conversationUsers_email_conversationId_key";

-- AlterTable
ALTER TABLE "conversationUsers" DROP CONSTRAINT "conversationUsers_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "groupName" TEXT,
ADD COLUMN     "isGroup" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "conversationUsers_userId_conversationId_key" ON "conversationUsers"("userId", "conversationId");

-- AddForeignKey
ALTER TABLE "conversationUsers" ADD CONSTRAINT "conversationUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
