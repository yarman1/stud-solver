/*
  Warnings:

  - A unique constraint covering the columns `[operation_name]` on the table `Area` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[operation_name]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `operation_name` to the `Area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operation_name` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "operation_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "operation_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Area_operation_name_key" ON "Area"("operation_name");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_operation_name_key" ON "Problem"("operation_name");
