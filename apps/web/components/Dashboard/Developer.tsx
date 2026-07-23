"use client";
import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import axios from "axios";
import { env } from "../../config/env";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDate, getContestStatus } from "../../config/util";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Contest {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  _count: {
    contestToChallengeMapping: number;
  };
}

const Developer = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState<Contest[]>([]);

  const fetchContest = async () => {
    try {
      const response = await axios.get(`${env.BACKEND_URL}/contest/all`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setContest(response.data.activeContest);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContest();
  }, []);
  return (
    <div>
      <main className="min-h-screen w-full">
        <div className="mt-4 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Browse Contest</h1>
            <h4 className="text-md text-neutral-400">
              Pick a contest and outshine other developers
            </h4>
          </div>
          <button className="font-medium  bg-orange-500 px-2 text-md rounded-lg h-fit py-2 cursor-pointer  hover:bg-orange-400  transition-colors ease-in-out">
            Active Contest
          </button>
        </div>

        <section className="grid grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <SkeletonTheme baseColor="#262626" highlightColor="#404040">
                    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                      <div className="flex justify-between">
                        <Skeleton width={80} height={24} />
                        <Skeleton width={100} height={24} />
                      </div>

                      <Skeleton className="mt-5" height={28} width="70%" />

                      <Skeleton className="mt-6" count={2} />

                      <div className="mt-8 flex justify-between">
                        <Skeleton width={90} height={36} />
                        <Skeleton width={80} height={36} />
                      </div>
                    </div>
                  </SkeletonTheme>
                </div>
              ))
            : contest.map((item) => {
                const contest = getContestStatus({
                  startTime: item.startTime,
                  endTime: item.endTime,
                });

                return (
                  <div
                    key={item.id}
                    className="group w-full rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-900/30"
                  >
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide border transition-all ${
                          contest.status === "UPCOMING"
                            ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                            : contest.status === "ONGOING"
                              ? "border-green-500/30 bg-green-500/10 text-green-400 animate-pulse"
                              : "border-red-500/30 bg-red-500/10 text-red-400"
                        }`}
                      >
                        {contest.status}
                      </div>

                      <h4 className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                        {item._count.contestToChallengeMapping} Challenges
                      </h4>
                    </div>

                    <div>
                      <h1 className="my-2 text-xl font-semibold transition-colors duration-300 group-hover:text-orange-400">
                        {item.title}
                      </h1>
                    </div>

                    <div className="mt-4">
                      <span className="text-xs text-neutral-400">
                        {formatDate(item.startTime)} —{" "}
                        {formatDate(item.endTime)}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="rounded-lg bg-yellow-500/10 px-3 py-2 text-sm font-bold text-yellow-400">
                        🏆 {item._count.contestToChallengeMapping * 100} Points
                      </div>

                      <button
                        onClick={() => router.push(`/contest/${item.id}`)}
                        className={`flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                          contest.status === "ENDED"
                            ? "cursor-not-allowed bg-neutral-800 text-neutral-500"
                            : "text-orange-400 hover:bg-orange-500 hover:text-black hover:scale-105"
                        }`}
                        disabled={contest.status === "ENDED"}
                      >
                        {contest.status === "ENDED" ? "Finished" : "Enter"}
                        {contest.status !== "ENDED" && (
                          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
        </section>
      </main>
    </div>
  );
};

export default Developer;
