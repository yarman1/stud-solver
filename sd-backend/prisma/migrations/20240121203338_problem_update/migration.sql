/*
  Warnings:

  - You are about to drop the column `broad_description` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `broad_description_url` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "broad_description",
ADD COLUMN     "broad_description_url" TEXT NOT NULL;
