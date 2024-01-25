-- AlterTable
ALTER TABLE "Solution" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "live_to" SET DEFAULT NOW() + interval '3 month';
