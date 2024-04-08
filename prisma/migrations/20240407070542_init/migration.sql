-- DropForeignKey
ALTER TABLE "conversationUsers" DROP CONSTRAINT "conversationUsers_conversationId_fkey";

-- AddForeignKey
ALTER TABLE "conversationUsers" ADD CONSTRAINT "conversationUsers_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
