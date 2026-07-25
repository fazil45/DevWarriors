import express, { Router } from "express";
import {
  createChallenges,
  deleteChallenges,
  getChallengeInContest,
  getChallengeProblem,
  submitIndependentChallenges,
} from "./challenges.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router: Router = express.Router();

router.use(authMiddleware);

router.delete(
  "/delete/:contestId/:challengeId",
  authMiddleware,
  deleteChallenges,
);
router.post("/createChallenges", authMiddleware, createChallenges);
router.get("/:challengeId/problem", getChallengeProblem);
router.get("/:contestId", getChallengeInContest);
router.post("/submit/:challengeId", submitIndependentChallenges);

export default router;
