"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { env } from "../../../config/env";
import { toast } from "sonner";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  maxPoints: number;
  contestToChallengeMapping: {
    contest: {
      title: string;
    };
  }[];
}
const Contest = () => {
  const params = useParams();
  const router = useRouter()
  const contestId = params.contestId as string;
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const fetchChallengesInContest = async (contestId: string) => {
    try {
      const response = await axios.get(
        `${env.BACKEND_URL}/contest/challenges/${contestId}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setChallenges(response.data.challenges);
      } else {
        toast.error("challenges not found");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const contestTitle =
    challenges[0]?.contestToChallengeMapping[0]?.contest.title;

  useEffect(() => {
    fetchChallengesInContest(contestId);
  }, []);

  return (
    <div className="min-h-screen bg-fixed bg-[radial-gradient(60%_50%_at_50%_0%,rgba(245,106,28,0.12),transparent_70%),radial-gradient(40%_40%_at_85%_20%,rgba(84,104,255,0.10),transparent_70%)]">
      {/* Content */}
      <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mt-4 ">
          <a className="flex items-center justify-start gap-2 group hover:text-orange-400 cursor-pointer">
            <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />{" "}
            Back to Contest
          </a>
        </div>
        <div className="mt-4">
          <h1 className="text-xl font-medium">{contestTitle}</h1>
        </div>
        <div className="grid grid-cols-3 gap-4 m-4">
          {challenges.map((item) => (
            <div
              key={item.id}
              className="group w-full rounded-xl border border-slate-800 bg-neutral-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-900/30"
            >
              <div>
                <h1 className="my-2 text-xl font-semibold transition-colors duration-300 group-hover:text-orange-400">
                  {item.title}
                </h1>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="rounded-lg bg-yellow-500/10 px-3 py-2 text-sm font-bold text-yellow-400">
                  🏆 {item.maxPoints * 10} Points
                </div>

                <button
                  onClick={() => router.push(`/contest/${contestId}/${item.id}`)}
                  className={`flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300`}
                >
                  Enter
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Contest;
