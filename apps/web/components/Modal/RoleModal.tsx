"use client";

import { X, Code2, Palette } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModal } from "../../store/showModal";

const RoleModal = () => {
  const router = useRouter();
  const { setShowModal } = useModal();

  return (
    <div
      onClick={() => setShowModal()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl border border-neutral-700 bg-neutral-900 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowModal()}
          className="absolute right-5 top-5 rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-orange-400"
        >
          <X size={20} />
        </button>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Create your account</h1>

          <p className="mt-2 text-sm text-neutral-400">
            Choose how you want to join the platform.
          </p>
        </div>

        {/* Developer */}
        <button
          onClick={() => router.push("/signup?role=developer")}
          className="group mb-4 flex w-full items-center gap-4 rounded-2xl border border-neutral-700 bg-neutral-800 px-5 py-4 transition-all duration-300 hover:border-orange-400 hover:bg-linear-to-r hover:from-orange-500 hover:to-orange-400 hover:shadow-lg hover:shadow-orange-500/20"
        >
          <div className="rounded-xl bg-neutral-700 p-3 transition group-hover:bg-white/20">
            <Code2 className="text-orange-400 group-hover:text-white" />
          </div>

          <div className="text-left">
            <h2 className="font-semibold text-lg text-white">Developer</h2>
            <p className="text-sm text-neutral-400 group-hover:text-orange-100">
              Compete with other developers in coding real world challenge.
            </p>
          </div>
        </button>

        {/* Creator */}
        <button
          onClick={() => router.push("/signup?role=creator")}
          className="group flex w-full items-center gap-4 rounded-2xl border border-neutral-700 bg-neutral-800 px-5 py-4 transition-all duration-300 hover:border-orange-400 hover:bg-linear-to-r hover:from-orange-500 hover:to-orange-400 hover:shadow-lg hover:shadow-orange-500/20"
        >
          <div className="rounded-xl bg-neutral-700 p-3 transition group-hover:bg-white/20">
            <Palette className="text-orange-400 group-hover:text-white" />
          </div>

          <div className="text-left">
            <h2 className="font-semibold text-lg text-white">Creator</h2>
            <p className="text-sm text-neutral-400 group-hover:text-orange-100">
              Create contest and challenges to make developers more advanced.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RoleModal;
