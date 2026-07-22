import express, { Router } from "express"
import {  createChallenges, createContests, getActiveContests, getChallengeInContest, getChallengeProblem, getContestById, getContestCreatedByDeveloper, getContestLeaderboard,  getContests,  submitChallenges, submitIndependentChallenges} from "./contest"
import { authMiddleware } from "../middleware/auth.middleware"
const router:Router = express.Router()

router.get("/active", getActiveContests)
router.get("/all", getContests)
router.use(authMiddleware)
router.get("/createdContest",getContestCreatedByDeveloper)
router.post("/createContest",createContests)
router.post("/createChallenges",createChallenges)
router.get("/challenge/:challengeId/problem", getChallengeProblem);
router.get("/:contestId", getContestById)
router.get("/challenges/:contestId", getChallengeInContest)
router.post("/submit/:challengeId",submitIndependentChallenges)
router.post("/submit/:contestId/:challengeId", submitChallenges)
router.get("/leaderboard/:contestId", getContestLeaderboard)

export default router