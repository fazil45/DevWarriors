/*
  Warnings:

  - You are about to drop the column `challengePrompt` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `challengePrompt` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "challengePrompt" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "challengePrompt";
