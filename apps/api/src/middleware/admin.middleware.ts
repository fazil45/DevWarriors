import { type Request, Response, NextFunction } from "express";
import { prisma } from "@repo/db/client";

export const roleMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId

    if (!userId) {
        return res.status(401).json({success:false, error:"Unauthenticated"})
    }

    const user = await prisma.user.findFirst({
        where:{
            id:userId
        }
    })

    if (!user) {
        return res.status(404).json({success:false, error :"Unauthorised"})
    }

    if (user.role === "CREATOR") {
        return res.status(403).json({success:false,error:"You are not authorised"})
    }

    next();
  } catch (error) {
    console.error("roleMiddleware error:", error);
    return res.status(500).json({success:false, error: "Internal server error" });
  }
};
