import { UserPlus, Swords, Trophy, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create your warrior',
    desc: 'Sign up in seconds. Pick your handle, set your domains, and choose your starting tier.',
  },
  {
    icon: Swords,
    title: 'Enter contests',
    desc: 'Join live timed competitions or practice in solo arenas. Squad up for team battles.',
  },
  {
    icon: TrendingUp,
    title: 'Solve challenges',
    desc: 'Climb through hundreds of challenges. Each solve earns points, XP, and badges.',
  },
  {
    icon: Trophy,
    title: 'Climb the ranks',
    desc: 'Earn your spot on the seasonal leaderboard. Top warriors win prizes and titles.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-28">
      <div className="container-x">
        <div className="text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Four steps to glory
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="card relative p-6">
              <span className="absolute right-5 top-4 font-display text-5xl font-bold text-white/5">
                0{i + 1}
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-ember-500/20 to-ember-700/5 text-ember-400">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
