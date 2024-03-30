-- AlterTable
ALTER TABLE "Solution" ALTER COLUMN "live_to" SET DEFAULT NOW() + interval '3 month';
