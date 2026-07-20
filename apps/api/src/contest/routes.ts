import express, { Router } from "express"
import {  createChallenges, createContests, getActiveContests, getContestLeaderboard,  getContests,  submitChallenges, submitIndependentChallenges} from "."
import { authMiddleware } from "../middleware/auth.middleware"
const router:Router = express.Router()

router.post("/createContest",createContests)
router.post("/createChallenges",createChallenges)
router.get("/active", getActiveContests)
router.get("/all", getContests)
// router.get("/finished", getCompletedContests)
router.get("/:contestId", getContestById)
router.post("/:challengeId",submitIndependentChallenges)
router.post("/submit/:contestId/:challengeId", submitChallenges)
router.get("/leaderboard/:contestId", getContestLeaderboard)

export default router