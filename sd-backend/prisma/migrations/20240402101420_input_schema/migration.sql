/*
  Warnings:

  - Added the required column `input_schema` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "input_schema" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Solution" ALTER COLUMN "live_to" SET DEFAULT NOW() + interval '3 month';
