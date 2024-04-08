/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ParticipantUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ParticipantUsers_email_key" ON "ParticipantUsers"("email");
