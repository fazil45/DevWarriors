import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { env } from "../../config/env";
import { ArrowRightIcon, Trash, Trash2, TruckElectric } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate, getContestStatus } from "../../config/util";
import CreateContestModal from "../Modal/CreateContestModal";
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

const Creator = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [contestCreate, setContestCreated] = useState<Contest[]>([]);

  const deleteContest = async (contestId: string) => {
    try {
      const response = await axios.delete(
        `${env.BACKEND_URL}/contest/delete/${contestId}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchContest();
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

  const fetchContest = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await axios.get(
        `${env.BACKEND_URL}/contest/createdContest`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setContestCreated(response.data.allContest);
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
      <div className="flex items-center justify-between mt-8 mb-6">
        {showModal && (
          <CreateContestModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onCreated={() => {
              setShowModal(false);
              fetchContest();
            }}
          />
        )}
        <div>
          <h1 className="text-4xl font-semibold mb-3">My Contests</h1>
          <h4 className="text-md font-normal">
            Create contests and manage their challenges.
          </h4>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="font-medium  bg-orange-500 px-2 text-md rounded-lg h-fit py-2 cursor-pointer  hover:bg-orange-400  transition-colors ease-in-out"
        >
          Create Contest
        </button>
      </div>
      <section className="grid grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <SkeletonTheme baseColor="#262626" highlightColor="#404040">
                  <div className="rounded-md border border-neutral-800 bg-neutral-900 p-5">
                    <div className="flex justify-between">
                      <Skeleton width={80} height={20} />
                      <Skeleton width={100} height={20} />
                    </div>

                    <Skeleton className="mt-3" height={22} width="50%" />

                    <Skeleton className="mt-4" count={2} />

                    <div className="mt-4 flex justify-between">
                      <Skeleton width={90} height={28} />
                      <Skeleton width={60} height={28} />
                    </div>
                  </div>
                </SkeletonTheme>
              </div>
            ))
          : contestCreate.map((item) => {
              const contest = getContestStatus({
                startTime: item.startTime,
                endTime: item.endTime,
              });

              return (
                <div
                  key={item.id}
                  className="group w-full rounded-md border border-neutral-800 bg-neutral-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-900/30"
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
                      {formatDate(item.startTime)} — {formatDate(item.endTime)}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="rounded-lg bg-yellow-500/10 px-3 py-2 text-sm font-bold text-yellow-400">
                      🏆 {item._count.contestToChallengeMapping * 100} Points
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => deleteContest(item.id)}>
                        <Trash2 className="h-5 w-5 cursor-pointer hover:text-orange-400" />
                      </button>
                      <button
                        onClick={() => router.push(`/contest/${item.id}`)}
                        className={`flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                          contest.status === "ENDED"
                            ? "cursor-pointer bg-neutral-800 text-neutral-500"
                            : "text-orange-400 hover:bg-orange-500 hover:text-black hover:scale-105"
                        }`}
                      >
                        {contest.status === "ENDED" ? "Finished" : "Enter"}
                        {contest.status !== "ENDED" && (
                          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </section>
    </div>
  );
};

export default Creator;
