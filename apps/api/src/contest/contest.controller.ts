import { prisma } from "@repo/db/client";
import { getTopPlayers, setupLeaderboard } from "@repo/redis";
import {
  ChallengeParamsSchema,
  ChallengeSchema,
  contestIdParams,
  ContestSchema,
  IDParamsSchema,
  LeaderboardSchema,
} from "@repo/zodschema";
import { type Request, Response } from "express";


export const createContests = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ success: false, error: "Unauthenticated" });
    }

    const parsedContestData = ContestSchema.safeParse(req.body);

    if (!parsedContestData.success) {
      return res.status(403).json({
        success: false,
        error: "Invalid inputs",
      });
    }

    const { title, startTime, endTime } = parsedContestData.data;

    const contest = await prisma.contest.create({
      data: {
        userId,
        title: title,
        startTime: startTime,
        endTime: endTime,
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

export const getActiveContests = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ success: false, error: "Unauthenticated" });
    }

    const activeContest = await prisma.contest.findMany({
      where: {
        startTime: { lte: new Date() },
        endTime: { gte: new Date() },
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        _count: {
          select: {
            contestToChallengeMapping: true,
          },
        },
      },
    });

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
    const allContest = await prisma.contest.findMany({
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        _count: {
          select: {
            contestToChallengeMapping: true,
          },
        },
      },
    });

    if (!allContest) {
      return res
        .status(404)
        .json({ success: false, error: "NO active contest available" });
    }

    res.status(200).json({
      success: true,
      allContest: allContest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "server error" });
  }
};

export const getContestCreatedByDeveloper = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ success: false, error: "Unauthenticated" });
    }

    const allContest = await prisma.contest.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        _count: {
          select: {
            contestToChallengeMapping: true,
          },
        },
      },
    });

    if (!allContest) {
      return res
        .status(404)
        .json({ success: false, error: "NO contest available" });
    }

    res.status(200).json({
      success: true,
      allContest: allContest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "server error" });
  }
};

export const getContestById = async (req: Request, res: Response) => {
  try {
    const parsedParamsData = contestIdParams.safeParse(req.params);

    if (!parsedParamsData.success) {
      return res
        .status(400)
        .json({ success: false, error: "contest not found" });
    }

    const contestId = parsedParamsData.data.contestId;

    const contest = await prisma.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    res.status(200).json({ success: true, contest: contest });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

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
  return res.status(200).json({
    empty: true,
    message: "No submissions yet — be the first to solve a challenge!",
  });
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

export const deleteContest = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ success: false, error: "Unauthorized" });
    }

    const parsedContestParamsData = contestIdParams.safeParse(req.params);

    if (!parsedContestParamsData.success) {
      return res.status(404).json({
        success: false,
        error: parsedContestParamsData.error.message,
      });
    }

    const contestId = parsedContestParamsData.data.contestId;

    const contest = await prisma.contest.findUnique({
      where: {
        id: contestId,
      },
      include: {
        contestToChallengeMapping: true,
      },
    });

    if (!contest) {
      return res
        .status(404)
        .json({ success: false, error: "Contest not found" });
    }

    if (contest?.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this contest",
      });
    }

    if (contest?.contestToChallengeMapping.length > 0) {
      return res.status(403).json({
        success: false,
        error: "Delete challenges in contest first",
      });
    }

    await prisma.contest.delete({
      where: {
        id: contestId,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Contest deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const getMyContestStatus = async (req: Request, res: Response) => {
  const userId = req.userId;
  const parsedParamsData = contestIdParams.safeParse(req.params)
  if (!parsedParamsData.success) {
    return res.status(403).json({
      success:false,
      error:parsedParamsData.error
    })
  }
  const contestId = parsedParamsData.data.contestId

  if (!userId) {
    return res.status(403).json({ success: false, error: "Unauthenticated" });
  }

  const entry = await prisma.leaderboard.findUnique({
    where: { contestId_userId: { contestId, userId } },
    select:{points:true},
  });

  res.status(200).json({
    success: true,
    hasSubmitted: !!entry,
    points: entry?.points ?? 0,
  });
};

export const submitContest = async (req: Request, res: Response) => {
  try {
    const parsedContestParamsData = contestIdParams.safeParse(req.params);

    if (!parsedContestParamsData.success) {
      return res.status(400).json({
        success: false,
        error: "invalid Id",
      });
    }

    const { contestId } = parsedContestParamsData.data;

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

    const total = await prisma.submission.aggregate({
      where: {
        userId,
        challenge: {
          contestToChallengeMapping: {
            some: { contestId },
          },
        },
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
