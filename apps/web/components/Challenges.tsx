"use client";
import { useState } from "react";
import {
  Code2,
  Database,
  Cpu,
  Globe,
  Shield,
  Braces,
  ArrowRight,
  Star,
} from "lucide-react";

type Challenge = {
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  points: number;
  solved: number;
  icon: typeof Code2;
};

const all: Challenge[] = [
  {
    title: "Two Sum Optimized",
    category: "Algorithms",
    difficulty: "Easy",
    points: 50,
    solved: 12400,
    icon: Code2,
  },
  {
    title: "LRU Cache Design",
    category: "Data Structures",
    difficulty: "Medium",
    points: 150,
    solved: 5600,
    icon: Database,
  },
  {
    title: "Lock-free Ring Buffer",
    category: "Concurrency",
    difficulty: "Expert",
    points: 400,
    solved: 410,
    icon: Cpu,
  },
  {
    title: "GraphQL Rate Limiter",
    category: "Backend",
    difficulty: "Hard",
    points: 250,
    solved: 1800,
    icon: Globe,
  },
  {
    title: "JWT Auth Middleware",
    category: "Security",
    difficulty: "Medium",
    points: 180,
    solved: 3200,
    icon: Shield,
  },
  {
    title: "Trie Autocomplete",
    category: "Data Structures",
    difficulty: "Medium",
    points: 160,
    solved: 4100,
    icon: Braces,
  },
  {
    title: "Red-Black Tree Rotation",
    category: "Algorithms",
    difficulty: "Hard",
    points: 280,
    solved: 920,
    icon: Code2,
  },
  {
    title: "WASM Image Pipeline",
    category: "Systems",
    difficulty: "Expert",
    points: 450,
    solved: 210,
    icon: Cpu,
  },
];

const categories = [
  "All",
  "Algorithms",
  "Data Structures",
  "Backend",
  "Security",
  "Systems",
  "Concurrency",
];

const diffStyles: Record<Challenge["difficulty"], string> = {
  Easy: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Medium: "text-orange-300 bg-orange-500/10 border-orange-500/20",
  Hard: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Expert: "text-rose-300 bg-rose-500/10 border-rose-500/20",
};

export default function Challenges() {
  const [active, setActive] = useState("All");
  const filtered =
    active === "All" ? all : all.filter((c) => c.category === active);

  return (
    <section id="challenges" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[32px_32px,32px_32px]" />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 relative">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
            Challenges
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sharpen your blue daily
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Hundreds of curated challenges across every domain. Filter by
            category, pick your difficulty, and start solving.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                active === cat
                  ? "border-orange-500/40 bg-orange-500/15 text-orange-300"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <article
              key={c.title}
              className="rounded-2xl border border-white/10 bg-ink-850/80 backdrop-blur-sm group flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:border-white/20"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5 text-orange-400 transition group-hover:bg-orange-500/15">
                <c.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-semibold text-white">
                    {c.title}
                  </h3>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-orange-300">
                    <Star className="h-3.5 w-3.5" /> {c.points}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2.5">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs font-medium ${diffStyles[c.difficulty]}`}
                  >
                    {c.difficulty}
                  </span>
                  <span className="text-xs text-slate-500">
                    {c.solved.toLocaleString()} solved
                  </span>
                </div>
              </div>
              <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-orange-400" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
