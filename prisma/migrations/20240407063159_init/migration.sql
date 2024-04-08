/*
  Warnings:

  - You are about to drop the `ParticipantUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ParticipantUsers" DROP CONSTRAINT "ParticipantUsers_conversationId_fkey";

-- DropTable
DROP TABLE "ParticipantUsers";

-- CreateTable
CREATE TABLE "participantUsers" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "conversationId" INTEGER NOT NULL,

    CONSTRAINT "participantUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participantUsers_id_email_key" ON "participantUsers"("id", "email");

-- AddForeignKey
ALTER TABLE "participantUsers" ADD CONSTRAINT "participantUsers_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
