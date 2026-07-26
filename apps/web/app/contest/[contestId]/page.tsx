"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { env } from "../../../config/env";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  ArrowRight,
  Award,
  Clock3,
  Code2,
  Crown,
  Loader2,
  Medal,
  Trash2,
  Trophy,
} from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useCurrentUser } from "../../../hooks/useAuth";
import CreateChallengeModal from "../../../components/Modal/CreateChallengeModal";

interface Challenge {
  id: string;
  title: string;
  maxPoints: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  contestToChallengeMapping: {
    contest: {
      title: string;
    };
  }[];
}

interface Leaderboard {
  rank: number;
  points: number;
  username: string;
}

const Contest = () => {
  const params = useParams();
  const router = useRouter();
  const contestId = params.contestId as string;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const { data: user } = useCurrentUser();
  const isCreator = user?.role === "CREATOR";

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${env.BACKEND_URL}/contest/submit/${contestId}`,
        {},
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success(response.data.success);
        window.location.reload();
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

  const getLeaderboard = async (contestId: string) => {
    try {
      const response = await axios.get(
        `${env.BACKEND_URL}/contest/leaderboard/${contestId}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setLeaderboard(response.data.leaderboard);
      } else if (response.data.empty) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleDelete = async ({
    contestId,
    challengeId,
  }: {
    contestId: string;
    challengeId: string;
  }) => {
    try {
      const response = await axios.delete(
        `${env.BACKEND_URL}/challenge/delete/${contestId}/${challengeId}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchChallengesInContest(contestId);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        toast.error(error.response?.data.error || "Something went wrong");
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };

  const fetchChallengesInContest = async (contestId: string) => {
    try {
      const response = await axios.get(
        `${env.BACKEND_URL}/challenge/${contestId}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setChallenges(response.data.challenges);
        console.log(response.data.challenges);
      } else {
        toast.error("challenges not found");
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

  const onCreated = (contestId: string) => {
    setShowModal(false);
    fetchChallengesInContest(contestId);
  };

  const contestTitle =
    challenges[0]?.contestToChallengeMapping[0]?.contest.title;

  useEffect(() => {
    fetchChallengesInContest(contestId);
    getLeaderboard(contestId);
  }, []);

  return (
    <div className="min-h-screen bg-fixed bg-[radial-gradient(60%_50%_at_50%_0%,rgba(245,106,28,0.12),transparent_70%),radial-gradient(40%_40%_at_85%_20%,rgba(84,104,255,0.10),transparent_70%)]">
      {isCreator && showModal && (
        <CreateChallengeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreated={(contestId) => onCreated(contestId)}
          contestId={contestId}
        />
      )}

      <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex items-center justify-between mt-4">
          <a
            onClick={() => router.back()}
            className="flex items-center justify-start gap-2 group cursor-pointer"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:text-orange-400 group-hover:translate-x-1" />{" "}
            Back to Contest
          </a>
          {isCreator ? (
            <button
              onClick={() => setShowModal(true)}
              className="font-medium  bg-orange-500 px-2 text-md rounded-lg h-fit py-2 cursor-pointer  hover:bg-orange-400  transition-colors ease-in-out"
            >
              Create Challenge
            </button>
          ) : (
            <button
              onClick={() => handleSubmit()}
              className="font-medium  bg-orange-500 px-2 text-md rounded-lg h-fit py-2 cursor-pointer  hover:bg-orange-400  transition-colors ease-in-out"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Submit contest"
              )}
            </button>
          )}
        </div>
        <div className="mt-4">
          <h1 className="text-4xl font-bold mb-4">
            {loading ? (
              <Skeleton
                width={"10%"}
                height={20}
                baseColor="#262626"
                highlightColor="#404040"
              />
            ) : (
              contestTitle
            )}
          </h1>
        </div>
        <div>
          <div className="mx-auto w-full max-w-7xl sm:px-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                  Leaderboard
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  The top warriors
                </h2>
                <p className="mt-3 max-w-xl text-slate-400">
                  Ranking points are earned by solving challenges and placing in
                  contests.
                </p>
              </div>
              <span className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
                Season 0
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-ink-850/80 backdrop-blur-sm mt-10 overflow-hidden">
              <div className="hidden grid-cols-12 gap-4 border-b border-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:grid">
                <div className="col-span-2">Rank</div>
                <div className="col-span-4">Warrior</div>
                <div className="col-span-6 text-right">Points</div>
              </div>
              <ul>
                {leaderboard &&
                  leaderboard.map((w) => {
                    const m = medal(w.rank);
                    return (
                      <li
                        key={w.rank}
                        className="grid grid-cols-12 items-center gap-4 border-b border-white/5 px-6 py-4 transition hover:bg-white/3 last:border-0"
                      >
                        <div className="col-span-2 flex items-center sm:col-span-1">
                          {m ? (
                            <m.icon className={`h-5 w-5 ${m.cls}`} />
                          ) : (
                            <span className="font-display text-sm font-semibold text-slate-500">
                              {w.rank}
                            </span>
                          )}
                        </div>
                        <div className="col-span-4 sm:col-span-5">
                          <div className="flex items-center gap-3">
                            <span className="grid h-9 w-9 place-items-center rounded-lg bg-linear-to-br from-ink-700 to-ink-800 font-display text-sm font-bold text-orange-300">
                              {w.username?.slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                              <p className="font-medium text-white">
                                {w.username}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-6 hidden text-right font-display font-semibold text-white sm:block">
                          {w.points.toLocaleString()}
                        </div>
                        <div className="col-span-1 hidden items-center justify-end gap-1 text-right sm:flex"></div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300 my-4">
          Challenges
        </span>
        <div className="grid grid-cols-3 gap-4 m-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <SkeletonTheme baseColor="#262626" highlightColor="#404040">
                    <div className="rounded-md border border-neutral-800 bg-neutral-900 p-5">
                      <Skeleton className="mt-3" height={22} width={"50%"} />
                      <div className="mt-4 flex justify-between">
                        <Skeleton width={90} height={28} />
                        <Skeleton width={90} height={28} />
                      </div>
                    </div>
                  </SkeletonTheme>
                </div>
              ))
            : challenges.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-md border border-neutral-800 bg-neutral-900 p-6 transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1 hover:shadow-2xl/10 shadow-orange-400"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-orange-500/10 text-orange-400">
                        <Code2 className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                          {item.title}
                        </h2>
                        <p className="text-sm text-neutral-500">
                          {"Backend Challenge"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`rounded-md px-3 py-1 text-xs font-medium ${item.difficulty === "EASY" && "text-green-400 bg-green-500/10"} ${item.difficulty === "MEDIUM" && "text-yellow-400 bg-yellow-500/10"} ${item.difficulty === "HARD" && "text-red-400 bg-red-500/10"}`}
                    >
                      {item.difficulty}
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <div className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3 py-2">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {item.maxPoints * 10}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3 py-2">
                      <Clock3 className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">30 mins</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4">
                    <span className="text-sm text-neutral-500">
                      Start solving
                    </span>

                    <div className="flex items-center justify-center gap-3">
                      {isCreator && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete({ contestId, challengeId: item.id });
                          }}
                          className="rounded-md border border-red-500/20 bg-red-500/50 p-2 text-red-400  transition-all duration-200 hover:bg-red-500 hover:text-white cursor-pointer"
                          title="Delete Challenge"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          router.push(`/contest/${contestId}/${item.id}`)
                        }
                        className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-orange-400"
                      >
                        Solve
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </main>
    </div>
  );
};

export default Contest;

const medal = (rank: number) => {
  if (rank === 1) return { icon: Crown, cls: "text-orange-400" };
  if (rank === 2) return { icon: Medal, cls: "text-slate-300" };
  if (rank === 3) return { icon: Award, cls: "text-amber-700" };
  return null;
};
