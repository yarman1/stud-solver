/*
  Warnings:

  - A unique constraint covering the columns `[user_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Solution" ALTER COLUMN "live_to" SET DEFAULT NOW() + interval '3 month';

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");
