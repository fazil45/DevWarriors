import { createClient } from "@redis/client";
const redisClient = createClient();
redisClient.connect()


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
};

export const getTopPlayers = async (contestId: string, limit = 10) =>  {
  const results = await redisClient.zRangeByScore(
    `leaderboard:${contestId}`,
    0,
    limit - 1,
    { REV: true } as any,
  );
    
  console.log(JSON.stringify(results, null, 2));
}
