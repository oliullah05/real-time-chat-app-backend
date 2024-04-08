/*
  Warnings:

  - You are about to drop the `participantUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "participantUsers" DROP CONSTRAINT "participantUsers_conversationId_fkey";

-- DropTable
DROP TABLE "participantUsers";

-- CreateTable
CREATE TABLE "conversationUsers" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "conversationId" INTEGER NOT NULL,

    CONSTRAINT "conversationUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conversationUsers_id_email_key" ON "conversationUsers"("id", "email");

-- AddForeignKey
ALTER TABLE "conversationUsers" ADD CONSTRAINT "conversationUsers_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
