-- AlterTable
ALTER TABLE "Solution" ADD COLUMN     "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "live_to" DATE NOT NULL DEFAULT NOW() + interval '1 month';
