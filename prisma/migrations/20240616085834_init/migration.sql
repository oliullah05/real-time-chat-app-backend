/*
  Warnings:

  - Made the column `participants` on table `conversations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "conversations" ALTER COLUMN "participants" SET NOT NULL;
