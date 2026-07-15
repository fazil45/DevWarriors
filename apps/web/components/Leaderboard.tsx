import { Crown, Medal, Award } from "lucide-react";

const warriors = [
  {
    rank: 1,
    name: "KiraHashimoto",
    points: 18420,
    solved: 412,
    streak: 28,
    change: "+0",
  },
  {
    rank: 2,
    name: "voidRunner",
    points: 17880,
    solved: 398,
    streak: 21,
    change: "+1",
  },
  {
    rank: 3,
    name: "quantumByte",
    points: 17210,
    solved: 376,
    streak: 14,
    change: "-1",
  },
  {
    rank: 4,
    name: "neoSamurai",
    points: 16540,
    solved: 351,
    streak: 9,
    change: "+2",
  },
  {
    rank: 5,
    name: "binaryPhoenix",
    points: 15920,
    solved: 340,
    streak: 12,
    change: "0",
  },
  {
    rank: 6,
    name: "cipherWolf",
    points: 15110,
    solved: 322,
    streak: 7,
    change: "-2",
  },
];

const medal = (rank: number) => {
  if (rank === 1) return { icon: Crown, cls: "text-orange-400" };
  if (rank === 2) return { icon: Medal, cls: "text-slate-300" };
  if (rank === 3) return { icon: Award, cls: "text-amber-700" };
  return null;
};

export default function Leaderboard() {
  return (
    <section id="leaderboard" className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
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
              contests. Season resets every 8 weeks.
            </p>
          </div>
          <span className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
            Season 7 · 23 days left
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-850/80 backdrop-blur-sm mt-10 overflow-hidden">
          <div className="hidden grid-cols-12 gap-4 border-b border-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:grid">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Warrior</div>
            <div className="col-span-2 text-right">Points</div>
            <div className="col-span-2 text-right">Solved</div>
            <div className="col-span-1 text-right">Streak</div>
            <div className="col-span-1 text-right">Change</div>
          </div>
          <ul>
            {warriors.map((w) => {
              const m = medal(w.rank);
              return (
                <li
                  key={w.rank}
                  className="grid grid-cols-12 items-center gap-4 border-b border-white/5 px-6 py-4 transition hover:bg-white/[0.03] last:border-0"
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
                  <div className="col-span-10 sm:col-span-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-ink-700 to-ink-800 font-display text-sm font-bold text-orange-300">
                        {w.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-medium text-white">{w.name}</p>
                        <p className="text-xs text-slate-500 sm:hidden">
                          {w.points.toLocaleString()} pts · {w.solved} solved
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 hidden text-right font-display font-semibold text-white sm:block">
                    {w.points.toLocaleString()}
                  </div>
                  <div className="col-span-2 hidden text-right text-slate-400 sm:block">
                    {w.solved}
                  </div>
                  <div className="col-span-1 hidden items-center justify-end gap-1 text-right sm:flex">
                    <span className="text-orange-400">🔥</span>
                    <span className="text-slate-400">{w.streak}</span>
                  </div>
                  <div
                    className={`col-span-1 hidden text-right text-sm font-medium sm:block ${
                      w.change.startsWith("+")
                        ? "text-blade-400"
                        : w.change.startsWith("-")
                          ? "text-rose-400"
                          : "text-slate-500"
                    }`}
                  >
                    {w.change}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
