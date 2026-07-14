import expres, { Router } from "express"
import { register, resendOTP, signin, verifyOtp } from "./auth"
const router:Router= expres.Router()

router.post("/signup", register)
router.post("/verifyEmail", verifyOtp)
router.post("/resendOTP", resendOTP)
router.post("/signin", signin)

export default router