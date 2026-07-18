import { prisma } from "@repo/db/client";
import { setupLeaderboard, getTopPlayers } from "@repo/redis";
import {
  ChallengeSchema,
  ContestSchema,
  contestSubmissionBodySchema,
  contestSubmissionParamSchema,
} from "@repo/zodschema";
import axios from "axios";
import { type Request, Response } from "express";

export const createContests = async (req: Request, res: Response) => {
  try {
    // const userId = req.userId;

    // if (userId) {
    //   return res.status(403).json({ success: false, error: "Unauthenticated" });
    // }

    const parsedContestData = ContestSchema.safeParse(req.body);

    if (!parsedContestData.success) {
      return res.status(403).json({
        success: false,
        error: "Invalid inputs",
      });
    }

    const { title, contestStartTime, contestEndTime } = parsedContestData.data;

    const contest = await prisma.contest.create({
      data: {
        title: title,
        startTime: new Date(Date.now() + contestStartTime * 60 * 60 * 1000),
        endTime: new Date(Date.now() + contestEndTime * 60 * 60 * 1000),
      },
    });

    res.status(201).json({
      success: true,
      message: "Contest created successfully",
      contestId: contest.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

export const createChallenges = async (req: Request, res: Response) => {
  try {
    // const userId = req.userId;

    // if (userId) {
    //   return res.status(403).json({ success: false, error: "Unauthenticated" });
    // }

    const parsedChallengeData = ChallengeSchema.safeParse(req.body);
    console.log(parsedChallengeData);

    if (!parsedChallengeData.success) {
      return res.status(403).json({ success: false, error: "Invalid inputs" });
    }

    const { contestId, index, maxPoints, notionDocId, title } =
      parsedChallengeData.data;

    const challenge = await prisma.$transaction(async (tx) => {
      return tx.challenge.create({
        data: {
          contestId,
          maxPoints,
          notionDocId,
          title,
          contestToChallengeMapping: {
            create: {
              index,
              contestId,
            },
          },
        },
      });
    });

    res.status(201).json({
      success: true,
      message: "Challenge created successfully",
      challenge: challenge,
    });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

export const getActiveContests = async (req: Request, res: Response) => {
  try {
    // const userId = req.userId;

    // if (userId) {
    //   return res.status(403).json({ success: false, error: "Unauthenticated" });
    // }

    const activeContest = await prisma.contest.findMany({
      where: {
        startTime: { lte: new Date() },
        endTime: { gte: new Date() },
      },
    });

    console.log(activeContest);

    if (!activeContest) {
      return res
        .status(404)
        .json({ success: false, error: "NO active contest available" });
    }

    res.status(200).json({
      success: true,
      activeContest: activeContest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "server error" });
  }
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

export const getContestLeaderboard = async (req: Request, res: Response) => {
  const contestId = req.params["contestId"];
};

export const submitIndependentChallenges = async (
  req: Request,
  res: Response,
) => {};

export const submitChallenges = async (req: Request, res: Response) => {
  try {
    //? Todo:
    // have rate limitting
    // max 20 submissions per problem
    // forward the request to GPT
    // store the response in sorted set and the DB

    const parsedContestParamsData = contestSubmissionParamSchema.safeParse(
      req.params,
    );

    if (!parsedContestParamsData.success) {
      return res.status(400).json({
        success: false,
        error: parsedContestParamsData.error.flatten(),
      });
    }

    const parsedContestBodyData = contestSubmissionBodySchema.safeParse(
      req.body,
    );

    if (!parsedContestBodyData.success) {
      return res.status(400).json({
        success: false,
        error: parsedContestBodyData.error.flatten(),
      });
    }

    const { contestId, challengeId } = parsedContestParamsData.data;
    const { points, submission } = parsedContestBodyData.data;

    const userId = req.body.userId;

    if (!userId) {
      return res.status(403).json({ success: false, error: "Unauthenticated" });
    }

    const contest = await prisma.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contest) {
      return res.status(404).json({
        success: false,
        error: "Contest not found",
      });
    }

    const now = new Date();

    if (contest.startTime > now) {
      return res.status(400).json({
        success: false,
        error: "Contest has not started yet",
      });
    }

    if (contest.endTime < now) {
      return res.status(400).json({
        success: false,
        error: "Contest has ended",
      });
    }

    const mapping = await prisma.contestToChallengeMapping.findUnique({
      where: {
        contestId_challengeId: { contestId, challengeId },
      },
    });

    if (!mapping) {
      return res.status(404).json({ success: false });
    }

    const challengeSubmission = await prisma.contestSubmission.create({
      data: {
        userId,
        points,
        submission,
        contestToChallengeMappingId: mapping.id,
      },
    });

    const total = await prisma.contestSubmission.aggregate({
      where: {
        userId,
        contestToChallengeMapping: { contestId },
      },
      _sum: { points: true },
    });

    const totalPoints = total._sum?.points ?? 0;

    await setupLeaderboard({ contestId, totalPoints, userId });

    res.status(200).json({
      success: true,
      message: "Submitted successfully",
      submission: challengeSubmission,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
