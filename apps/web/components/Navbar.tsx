"use client";
import { useEffect, useState } from "react";
import { Swords, Menu, X } from "lucide-react";
import { useModal } from "../store/showModal";
import { useRouter } from "next/navigation";

const links = [
  { label: "Contests", href: "#contests" },
  { label: "Challenges", href: "#challenges" },
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "How it works", href: "#how" },
];

export default function Navbar() {
  const router = useRouter()
  const {setShowModal, showModal} = useModal()
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-neutral-800/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <a onClick={() => {
          router.push("/")
        }} className="flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-linear-to-br from-orange-400 to-orange-600 text-neutral-950">
            <Swords className="h-6 w-6 font-light" strokeWidth={3} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-shadow-2xl text-white">
            Dev<span className="text-orange-500">Warriors</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/signin"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Sign in
          </a>
          <a
            onClick={() => setShowModal()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-br from-orange-400 to-orange-600 px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-glow transition hover:from-orange-300 hover:to-orange-500 hover:-translate-y-0.5 active:translate-y-0"
          >
            Join the arena
          </a>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-ink-900/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-3">
              <a
                href="/siginin"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 hover:-translate-y-0.5"
              >
                Sign in
              </a>
              <a
                href="#contests"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-br from-orange-400 to-orange-600 px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:from-orange-300 hover:to-orange-500 hover:-translate-y-0.5 active:translate-y-0"
              >
                Join
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
