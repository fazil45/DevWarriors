import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="container-x">
        <div className="card relative overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[640px] -translate-x-1/2 rounded-full bg-ember-600/15 blur-[110px]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your code is your weapon. <span className="text-gradient">Wield it.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-400">
              Join 48,000+ developers battling through contests and challenges every week. It is
              free to start.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#" className="btn-primary group">
                Create your warrior
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a href="#contests" className="btn-ghost">
                See live contests
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
