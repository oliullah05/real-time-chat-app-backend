/*
  Warnings:

  - A unique constraint covering the columns `[email,conversationId]` on the table `conversationUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "conversationUsers_conversationId_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "conversationUsers_email_conversationId_key" ON "conversationUsers"("email", "conversationId");
