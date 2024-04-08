/*
  Warnings:

  - A unique constraint covering the columns `[conversationId,email]` on the table `conversationUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "conversationUsers_id_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "conversationUsers_conversationId_email_key" ON "conversationUsers"("conversationId", "email");
