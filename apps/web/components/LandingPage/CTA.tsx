import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="rounded-2xl border border-white/10 bg-ink-850/80 backdrop-blur-sm relative overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-160 -translate-x-1/2 rounded-full bg-orange-600/15 blur-[110px]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your code is your weapon.{" "}
              <span className="mx-auto w-full max-w-7xl px-5 sm:px-8">
                Wield it.
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-400">
              Join 48,000+ developers battling through contests and challenges
              every week. It is free to start.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-br from-orange-400 to-orange-600 px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:from-orange-300 hover:to-orange-500 hover:-translate-y-0.5 active:translate-y-0"
              >
                Create your warrior
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="#contests"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 hover:-translate-y-0.5"
              >
                See live contests
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
