"use client";
import { ArrowRight, Flame, Trophy, Users } from "lucide-react";
import RoleModal from "../Modal/RoleModal";
import { useModal } from "../../store/showModal";

const stats = [
  { icon: Users, value: "48K+", label: "Active warriors" },
  { icon: Flame, value: "1,204", label: "Challenges solved" },
  { icon: Trophy, value: "92", label: "Live contests" },
];

export default function Hero() {
  const { showModal } = useModal();

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <div
        className={`z-100  w-full h-full  items-center justify-center ${showModal ? "flex" : "hidden"}`}
      >
        <RoleModal />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,black_50%,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 -top-1/3 h-105 w-250 -translate-x-1/2 rounded-full bg-orange-500/30 blur-[120px]" />

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-orange-500" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            Contest season now live
          </span>

          <h1 className="mt-6 font-display  flex flex-col items-center justify-center lg:text-9xl  font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            <span className="flex gap-x-6">
              Where <span className="text-orange-500">coders</span> become
            </span>
            <span className="mx-auto w-full max-w-7xl px-5 sm:px-8">
              warriors
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Enter weekly coding contests, battle through curated challenges,
            climb the leaderboard, and earn your place among the elite.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contests"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-br from-orange-400 to-orange-600 px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:from-orange-300 hover:to-orange-500 hover:-translate-y-0.5 active:translate-y-0 group"
            >
              Enter the arena
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#challenges"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 hover:-translate-y-0.5"
            >
              Browse challenges
            </a>
          </div>

          <dl className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-neutral-800/70 backdrop-blur-sm px-4 py-5 text-center"
              >
                <dt className="flex items-center justify-center text-orange-400">
                  <s.icon className="h-5 w-5" />
                </dt>
                <dd className="mt-2 font-display text-2xl font-bold text-white">
                  {s.value}
                </dd>
                <dd className="mt-0.5 text-xs text-slate-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
