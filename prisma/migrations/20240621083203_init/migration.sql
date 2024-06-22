-- AlterTable
ALTER TABLE "conversations" ALTER COLUMN "lastMessageType" DROP DEFAULT;

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "type" DROP DEFAULT;
