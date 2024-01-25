-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_area_id_fkey";

-- DropForeignKey
ALTER TABLE "Solution" DROP CONSTRAINT "Solution_problem_id_fkey";

-- DropForeignKey
ALTER TABLE "Solution" DROP CONSTRAINT "Solution_user_id_fkey";

-- AlterTable
ALTER TABLE "Solution" ALTER COLUMN "live_to" SET DEFAULT NOW() + interval '3 month';

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("area_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "Problem"("problem_id") ON DELETE CASCADE ON UPDATE CASCADE;
