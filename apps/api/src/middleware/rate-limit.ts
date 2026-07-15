import rateLimit from "express-rate-limit";

export const requestLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 8,
  keyGenerator: (req) => {
    return `${req.body.email}`;
  },
  message: {
    success: false,
    error: "Too many OTP requests. Please try again after 5 minutes.",
  },
  standardHeaders:true,
  legacyHeaders:false
});