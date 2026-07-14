import { type Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(403)
        .json({ success: false, error: "token is expired or not defined" });
    }

    const decodedInformation = jwt.verify(token, JWT_SECRET!) as JwtPayload;

    if (!decodedInformation) {
      return res.status(403).json({ success: false, error: "Unauthorised" });
    }

    req.userId = decodedInformation.id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "Token expired",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }

    console.error("authMiddleware error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
