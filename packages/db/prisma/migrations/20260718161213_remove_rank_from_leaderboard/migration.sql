/*
  Warnings:

  - You are about to drop the column `rank` on the `Leaderboard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contestId,userId]` on the table `Leaderboard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `points` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Leaderboard_contestId_rank_key";

-- AlterTable
ALTER TABLE "Leaderboard" DROP COLUMN "rank",
ADD COLUMN     "points" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_contestId_userId_key" ON "Leaderboard"("contestId", "userId");
