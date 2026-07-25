import { prisma } from "@repo/db/client";
import {
  ChallengeParamsSchema,
  ChallengeSchema,
  contestIdParams,
  IDParamsSchema,
} from "@repo/zodschema";
import { type Request, Response } from "express";
import { validateUserSubmission } from "../service/gemini-client";
import { getProblemCached } from "@repo/redis";

type Difficulty = "EASY" | "MEDIUM" | "HIGH"



export const createChallenges = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ success: false, error: "Unauthenticated" });
    }

    const parsedChallengeData = ChallengeSchema.safeParse(req.body);

    if (!parsedChallengeData.success) {
      return res.status(403).json({ success: false, error: "Invalid inputs" });
    }

    console.log(parsedChallengeData.error)    
    console.log(parsedChallengeData)    


    const { contestId, index, maxPoints, notionDocId, title, challengePrompt,difficulty } =
      parsedChallengeData.data;

    const challenge = await prisma.$transaction(async (tx) => {
      return tx.challenge.create({
        data: {
          contestId,
          maxPoints,
          notionDocId,
          title,
          challengePrompt,
          difficulty: difficulty as Difficulty,
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

export const getChallengeInContest = async (req: Request, res: Response) => {
  try {
    const parsedChallengeData = contestIdParams.safeParse(req.params);

    if (!parsedChallengeData.success) {
      return res
        .status(400)
        .json({ success: false, error: parsedChallengeData.error.flatten() });
    }

    const contestId = parsedChallengeData.data.contestId;

    const challenges = await prisma.challenge.findMany({
      where: {
        contestId,
      },
      select: {
        id: true,
        title: true,
        maxPoints: true,
        contestToChallengeMapping: {
          select: {
            contest: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ success: true, challenges: challenges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getChallengeProblem = async (req: Request, res: Response) => {
  try {
    const parsedParamsData = ChallengeParamsSchema.safeParse(req.params);

    if (!parsedParamsData.success) {
      return res
        .status(400)
        .json({ success: false, error: parsedParamsData.error.flatten() });
    }
    const { challengeId } = parsedParamsData.data;
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, error: "Challenge not found" });
    }

    const problemStatement = await getProblemCached(challenge.notionDocId);

    res.status(200).json({
      success: true,
      problem: {
        title: challenge.title,
        problemStatement,
        maxPoints: challenge.maxPoints,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to load problem" });
  }
};

export const deleteChallenges = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Unauthenticated",
      });
    }

    const parsedParamsData = IDParamsSchema.safeParse(req.params);

    if (!parsedParamsData.success) {
      return res.status(404).json({
        success: false,
        error: "Invalid inputs",
      });
    }

    const { challengeId, contestId } = parsedParamsData.data;

    await prisma.$transaction([
      prisma.contestToChallengeMapping.delete({
        where: {
          contestId_challengeId: { contestId, challengeId },
          contest: {
            userId: userId,
          },
        },
      }),
      prisma.challenge.delete({
        where: {
          id: challengeId,
          contestId: contestId,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Challenge deleted",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Challenge or mapping not found",
      });
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const submitIndependentChallenges = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;
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
  const challengeId = parsedParamsData.data.challengeId;
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

  const noctionDocId = await getProblemCached(challenge?.notionDocId!);

  const result = await validateUserSubmission({
    problem: noctionDocId,
    submission,
    problemPrompt,
  });

  await prisma.submission.upsert({
    where: { userId_challengeId: { userId, challengeId } },
    update: { submission, points: result.totalScore },
    create: { submission, points: result.totalScore, userId, challengeId },
  });

  res.status(200).json({
    success: true,
    message: "Challenge Submit Successfully",
    result: result,
  });
};

