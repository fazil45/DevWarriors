/*
  Warnings:

  - You are about to drop the `ContestSubmission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `difficulty` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HIGH');

-- DropForeignKey
ALTER TABLE "ContestSubmission" DROP CONSTRAINT "ContestSubmission_contestToChallengeMappingId_fkey";

-- DropForeignKey
ALTER TABLE "ContestSubmission" DROP CONSTRAINT "ContestSubmission_userId_fkey";

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "difficulty" "Difficulty" NOT NULL;

-- DropTable
DROP TABLE "ContestSubmission";
