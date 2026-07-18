import { createClient } from "@redis/client";
import { prisma } from "@repo/db/client";
const redisClient = createClient();
redisClient.connect();

export const setupLeaderboard = async ({
  totalPoints,
  contestId,
  userId,
}: {
  totalPoints: number;
  contestId: string;
  userId: string;
}) => {

  await redisClient.zAdd(`leaderboard:${contestId}`, {
    score: totalPoints,
    value: userId,
  });

  await prisma.leaderboard.upsert({
    where: { contestId_userId: { contestId, userId } },
    update: { points: totalPoints },
    create: { contestId, userId, points: totalPoints },
  });

};

export const getTopPlayers = async (contestId: string, limit = 10) => {
  const results = await redisClient.zRangeWithScores(
    `leaderboard:${contestId}`,
    0,
    limit - 1,
    { REV: true } as any,
  );

  console.log(JSON.stringify(results, null, 2));

  return results.map((r, i) => ({
    rank: i + 1,
    userId:r.value,
    points:r.score
  }))
};

export const getUserRank = async (contestId:string,userId:string) => {
  const rank = await redisClient.zRevRank(`leaderboard:${contestId}`,userId)
  const points = await redisClient.zScore(`leaderboard:${contestId}`,userId)

  return {
    rank: rank !== null ? rank + 1 : null,
    points: points ?? 0
  }
}