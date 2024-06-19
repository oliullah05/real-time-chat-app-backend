/*
  Warnings:

  - Made the column `lastMessageType` on table `conversations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "conversations" ALTER COLUMN "lastMessageType" SET NOT NULL;
