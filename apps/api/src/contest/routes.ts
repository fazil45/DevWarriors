import express, { Router } from "express"
import {  createChallenges, createContests, getActiveContests,  getCompletedContests,  getContestById, getContestLeaderboard, getContestWithChallenges, submitChallenges, submitIndependentChallenges} from "."
const router:Router = express.Router()

router.post("/createContest",createContests)
router.post("/createChallenges",createChallenges)
router.get("/active", getActiveContests)
router.get("/finished", getCompletedContests)
router.get("/:contestId", getContestById)
router.get("/:contestId/:challengeId", getContestWithChallenges)
router.post("/:challengeId",submitIndependentChallenges)
router.post("/submit/:contestId/:challengeId", submitChallenges)
router.get("/leaderboard/:contestId", getContestLeaderboard)

export default router