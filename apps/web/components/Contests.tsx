import { Clock, Trophy, Users, Zap, ChevronRight } from "lucide-react";

type Contest = {
  title: string;
  tag: string;
  status: "Live" | "Upcoming" | "Featured";
  startsIn: string;
  participants: string;
  difficulty: string;
  accent: string;
};

const contests: Contest[] = [
  {
    title: "Algorithm Showdown VII",
    tag: "Algorithms",
    status: "Live",
    startsIn: "Ends in 2d 14h",
    participants: "3.2K",
    difficulty: "Hard",
    accent: "from-orange-500/20 to-orange-700/5",
  },
  {
    title: "Frontend Forge",
    tag: "UI / UX",
    status: "Featured",
    startsIn: "Starts in 3 days",
    participants: "1.8K",
    difficulty: "Medium",
    accent: "from-orange-500/20 to-orange-600/5",
  },
  {
    title: "Systems Siege",
    tag: "Low-level",
    status: "Upcoming",
    startsIn: "Starts in 9 days",
    participants: "920",
    difficulty: "Expert",
    accent: "from-blue-500/20 to-blue-600/5",
  },
];

const statusStyles: Record<Contest["status"], string> = {
  Live: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  Upcoming: "bg-blue-500/15 text-blue-300 border-slate-blue/20",
  Featured: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

export default function Contests() {
  return (
    <section id="contests" className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
              Contests
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Battle in live contests
            </h2>
            <p className="mt-3 max-w-xl text-slate-400">
              Timed competitions across algorithms, frontend, and systems. Join
              solo or squad up — prizes, ranking points, and glory are on the
              line.
            </p>
          </div>
          <a
            href="#"
            className="group flex items-center gap-1 text-sm font-medium text-orange-400 hover:text-orange-300"
          >
            View all contests
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {contests.map((c) => (
            <article
              key={c.title}
              className={`rounded-2xl border border-white/10 bg-ink-850/80 backdrop-blur-sm group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:border-white/20 ${c.accent} bg-linear-to-br`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[c.status]}`}
                >
                  {c.status === "Live" && (
                    <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
                  )}
                  {c.status}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {c.tag}
                </span>
              </div>

              <h3 className="mt-5 font-display text-xl font-bold text-white">
                {c.title}
              </h3>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-500" /> {c.startsIn}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-500" /> {c.participants}
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-slate-500" /> {c.difficulty}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                <a
                  href="#"
                  className="rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-orange-500 group-hover:text-ink-950"
                >
                  {c.status === "Upcoming" ? "Register" : "Join now"}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
