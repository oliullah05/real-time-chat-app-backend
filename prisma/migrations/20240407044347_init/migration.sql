/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_conversationId_fkey";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "ParticipantUsers" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "conversationId" INTEGER NOT NULL,

    CONSTRAINT "ParticipantUsers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParticipantUsers" ADD CONSTRAINT "ParticipantUsers_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
