"use client";
import React from "react";
import { useCurrentUser } from "../hooks/useAuth";
import axios from "axios";
import { env } from "../config/env";
import { toast } from "sonner";

const MobileProfile = () => {
  const { data: user } = useCurrentUser();

  const signout = async () => {
    try {
      const response = await axios.post(
        `${env.BACKEND_URL}/user/signout`,
        {},
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        window.location.reload();
      } else {
        toast.error("Try again");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <aside className="fixed right-0 top-14 z-50 flex h-fit w-full flex-col border-l border-neutral-800 bg-neutral-900 text-white">
      <div className="border-b border-neutral-800 px-8 py-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/30 bg-neutral-800 text-xl font-semibold text-orange-400">
            {user?.firstName?.[0]?.toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>

            <p className="text-sm text-neutral-400">@{user?.username}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex px-8 py-4">
        <div className="space-y-1">
          <div className="border-b border-neutral-800 pb-3">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              Name
            </p>

            <p className="mt-2 text-neutral-200">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div className="border-b border-neutral-800 pb-3">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              Email
            </p>

            <p className="mt-2 text-neutral-200">{user?.email}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              Username
            </p>

            <p className="mt-2 text-neutral-200">@{user?.username}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-800 p-6">
        <button className="mb-3 w-full rounded-lg border border-orange-500/30 bg-orange-500/10 py-3 font-medium text-orange-400 transition hover:bg-orange-500/20 cursor-pointer">
          Update Profile
        </button>

        <button
          onClick={signout}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 py-3 font-medium text-neutral-300 transition hover:border-neutral-600 hover:bg-neutral-700 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default MobileProfile;
