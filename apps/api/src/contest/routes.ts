import express, { Router } from "express";
import {
  createContests,
  deleteContest,
  getActiveContests,
  getContestById,
  getContestCreatedByDeveloper,
  getContestLeaderboard,
  getContests,
  submitContest,
} from "./contest.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router: Router = express.Router();

router.get("/active", getActiveContests);
router.get("/all", getContests);
router.use(authMiddleware);
router.delete("/delete/:contestId", deleteContest);
router.get("/createdContest", getContestCreatedByDeveloper);
router.post("/createContest", createContests);
router.get("/:contestId", getContestById);
router.post("/submit/:contestId/:challengeId", submitContest);
router.get("/leaderboard/:contestId", getContestLeaderboard);

export default router;
