import express, { Router } from "express"
import {  getActiveContests,  getCompletedContests,  getContestById, getContestLeaderboard, getContestWithChallenges, submitChallengeSolution} from "."
const router:Router = express.Router()

router.get("/active", getActiveContests)
router.get("/finished", getCompletedContests)
router.get("/:contestId", getContestById)
router.get("/:contestId/:challengeId", getContestWithChallenges)
router.get("/leaderboard/:contestId", getContestLeaderboard)
router.post("/submit/:challengeId", submitChallengeSolution)

export default router