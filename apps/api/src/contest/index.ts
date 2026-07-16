import { prisma } from "@repo/db/client";
import { type Request, Response } from "express";

export const createContests = async (req: Request, res: Response) => {
  try {
    const contestTitle = req.body.title;
    const contestStartTime = req.body.contestStartTime;

    const contest = await prisma.contest.create({
      data: {
        title: contestTitle,
        startTime: new Date(contestStartTime),
      },
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Contest created successfully",
        contestId: contest.id,
      });
  } catch (error) {}
};

export const createChallenges = async (req: Request, res: Response) => {
  try {
    const contestTitle = req.body.title;
    const contestStartTime = req.body.contestStartTime;

    const contest = await prisma.contest.create({
      data: {
        title: contestTitle,
        startTime: new Date(contestStartTime),
      },
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Contest created successfully",
        contestId: contest.id,
      });
  } catch (error) {}
};

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
