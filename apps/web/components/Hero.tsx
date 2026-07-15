
import { ArrowRight, Flame, Trophy, Users } from 'lucide-react';

const stats = [
  { icon: Users, value: '48K+', label: 'Active warriors' },
  { icon: Flame, value: '1,204', label: 'Challenges solved' },
  { icon: Trophy, value: '92', label: 'Live contests' },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 grid-pattern" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-ember-600/10 blur-[120px]" />

      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-ember-500" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ember-500" />
            </span>
            Season 7 now live
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Where coders become
            <br className="hidden sm:block" /> <span className="text-gradient">warriors</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Enter weekly coding contests, battle through curated challenges, climb the
            leaderboard, and earn your place among the elite.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#contests" className="btn-primary group">
              Enter the arena
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a href="#challenges" className="btn-ghost">
              Browse challenges
            </a>
          </div>

          <dl className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="card px-4 py-5 text-center">
                <dt className="flex items-center justify-center text-ember-400">
                  <s.icon className="h-5 w-5" />
                </dt>
                <dd className="mt-2 font-display text-2xl font-bold text-white">{s.value}</dd>
                <dd className="mt-0.5 text-xs text-slate-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
