/*
  Warnings:

  - A unique constraint covering the columns `[participants]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "conversations_participants_key" ON "conversations"("participants");
