import { type Request, Response } from "express";

export const getActiveContests = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (userId) {
      return res.status(403).json({ success: false, error: "Unauthenticated" });
    }

    

  } catch (error) {}
};

export const getCompletedContests = async (req: Request, res: Response) => {
  const { offset, page } = req.query;
};

export const getContestById = async (req: Request, res: Response) => {
  const { offset, page } = req.query;
};

export const getContestWithChallenges = async (
  req: Request,
  res: Response,
) => {};

export const getContestLeaderboard = async (req: Request, res: Response) => {};

export const submitChallengeSolution = async (req: Request, res: Response) => {
  // have rate limitting
  // max 20 submissions per problem
  // forward the request to GPT
  // store the response in sorted set and the DB
};
