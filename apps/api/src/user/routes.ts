import expres, { Router } from "express"
import { checkUsername, register, resendOTP, signin, verifyOtp } from "./auth"
import { requestLimiter } from "../middleware/rate-limit"
const router:Router= expres.Router()

router.post("/signup",requestLimiter, register)
router.post("/verify-otp",requestLimiter, verifyOtp)
router.post("/resend-otp",requestLimiter, resendOTP)
router.post("/signin",requestLimiter, signin)
router.get("/checkUsername", checkUsername)

export default router