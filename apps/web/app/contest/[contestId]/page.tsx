"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { env } from "../../../config/env";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  ArrowRight,
  Clock3,
  Code2,
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
  contestToChallengeMapping: {
    contest: {
      title: string;
    };
  }[];
}
const Contest = () => {
  const params = useParams();
  const router = useRouter();
  const contestId = params.contestId as string;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const { data: user } = useCurrentUser();
  const isCreator = user?.role === "CREATOR";

  const handleDelete = async ({
    contestId,
    challengeId,
  }: {
    contestId: string;
    challengeId: string;
  }) => {
    try {
      const response = await axios.delete(
        `${env.BACKEND_URL}/contest/delete/${contestId}/${challengeId}`,
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
          {isCreator && (
            <button
              onClick={() => setShowModal(true)}
              className="font-medium  bg-orange-500 px-2 text-md rounded-lg h-fit py-2 cursor-pointer  hover:bg-orange-400  transition-colors ease-in-out"
            >
              Create Challenge
            </button>
          )}
        </div>
        <div className="mt-4">
          <h1 className="text-xl font-medium">
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

                    <div className="rounded-md bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                      {"Easy"}
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
