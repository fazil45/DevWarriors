import { prisma } from "@repo/db/client";
import { getTopPlayers, setupLeaderboard } from "@repo/redis";
import {
  ChallengeParamsSchema,
  ChallengeSchema,
  ContestSchema,
  contestSubmissionParamSchema,
  LeaderboardSchema,
} from "@repo/zodschema";
import { type Request, Response } from "express";
import { validateUserSubmission } from "../config/gemini-client";
import { getProblem } from "../config/notion-problem";

export const createContests = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (userId) {
      return res.status(403).json({ success: false, error: "Unauthenticated" });
    }

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
    const userId = req.userId;

    if (userId) {
      return res.status(403).json({ success: false, error: "Unauthenticated" });
    }

    const parsedChallengeData = ChallengeSchema.safeParse(req.body);
    console.log(parsedChallengeData);

    if (!parsedChallengeData.success) {
      return res.status(403).json({ success: false, error: "Invalid inputs" });
    }

    const { contestId, index, maxPoints, notionDocId, title, challengePrompt } =
      parsedChallengeData.data;

    const challenge = await prisma.$transaction(async (tx) => {
      return tx.challenge.create({
        data: {
          contestId,
          maxPoints,
          notionDocId,
          title,
          challengePrompt,
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
    const userId = req.userId;

    if (userId) {
      return res.status(403).json({ success: false, error: "Unauthenticated" });
    }

    const activeContest = await prisma.contest.findMany({
      where: {
        startTime: { lte: new Date() },
        endTime: { gte: new Date() },
      },
      select:{title:true,startTime:true, endTime:true,_count:{
        select:{
          contestToChallengeMapping:true
        },
      }}
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

export const getContests = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (userId) {
      return res.status(403).json({ success: false, error: "Unauthenticated" });
    }

    const activeContest = await prisma.contest.findMany({
      select:{title:true,startTime:true, endTime:true,_count:{
        select:{
          contestToChallengeMapping:true
        },
      }}
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

export const getContes

export const getContestLeaderboard = async (req: Request, res: Response) => {
  const parsedContestData = LeaderboardSchema.safeParse(req.params);

  if (!parsedContestData.success) {
    return res
      .status(400)
      .json({ success: false, error: parsedContestData.error.flatten() });
  }

  const { contestId } = parsedContestData.data;

  const topPlayers = await getTopPlayers(contestId);

  if (topPlayers.length === 0) {
    return res
      .status(404)
      .json({ success: false, error: "Leaderboard not available" });
  }

  const userIds = topPlayers.map((p) => p.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, username: true, firstName: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  const leaderboard = topPlayers.map((p) => ({
    rank: p.rank,
    points: p.points,
    username: userMap.get(p.userId)?.username,
  }));

  if (!leaderboard) {
    return res
      .status(404)
      .json({ success: false, error: "Leaderboard not available" });
  }

  res.status(200).json({ success: true, leaderboard: leaderboard });
};

export const submitIndependentChallenges = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;
  console.log(userId);
  if (!userId) {
    return res.status(400).json({ success: false, error: "Unauthenticated" });
  }

  const parsedParamsData = ChallengeParamsSchema.safeParse(req.params);

  if (!parsedParamsData.success) {
    return res
      .status(400)
      .json({ success: false, error: parsedParamsData.error.flatten() });
  }

  const submission = req.body.submission;
  const { challengeId } = parsedParamsData.data;

  const challenge = await prisma.challenge.findUnique({
    where: {
      id: challengeId,
    },
  });

  if (!challenge) {
    return res
      .status(404)
      .json({ success: false, error: "challenge not found" });
  }

  const problemPrompt = challenge.challengePrompt;

  const noctionDocId = await getProblem(challenge?.notionDocId!);

  const Res = await validateUserSubmission({
    problem: noctionDocId,
    submission,
    problemPrompt,
  });

  await prisma.submission.upsert({
    where: { userId_challengeId: { userId, challengeId } },
    update: { submission, points: Res.totalScore },
    create: { submission, points: Res.totalScore, userId, challengeId },
  });

  res.status(200).json({
    success: true,
    message: "Challenge Submit Successfully",
    reasoning: Res.reasoning,
  });
};

export const submitChallenges = async (req: Request, res: Response) => {
  try {
    const parsedContestParamsData = contestSubmissionParamSchema.safeParse(
      req.params,
    );

    if (!parsedContestParamsData.success) {
      return res.status(400).json({
        success: false,
        error: parsedContestParamsData.error.flatten(),
      });
    }

    const { contestId, challengeId } = parsedContestParamsData.data;

    const userId = req.userId;

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
      message: "Contest Submitted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
