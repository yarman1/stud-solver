-- DropIndex
DROP INDEX "User_user_id_key";

-- CreateTable
CREATE TABLE "Area" (
    "area_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "picture_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("area_id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "problem_id" SERIAL NOT NULL,
    "area_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "picture_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "broad_description" TEXT NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("problem_id")
);

-- CreateTable
CREATE TABLE "Solution" (
    "solution_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "expression" TEXT NOT NULL,
    "result" TEXT NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("solution_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Area_name_key" ON "Area"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_name_key" ON "Problem"("name");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("area_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "Problem"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;
