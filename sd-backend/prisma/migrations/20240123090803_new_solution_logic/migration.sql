/*
  Warnings:

  - You are about to drop the column `additional_data_json` on the `Solution` table. All the data in the column will be lost.
  - You are about to drop the column `expression` on the `Solution` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `Solution` table. All the data in the column will be lost.
  - Added the required column `result_html` to the `Solution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Solution" DROP COLUMN "additional_data_json",
DROP COLUMN "expression",
DROP COLUMN "result",
ADD COLUMN     "result_html" TEXT NOT NULL;
