import { Swords } from "lucide-react";
import type { IconType } from "react-icons";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const cols = [
  {
    title: "Compete",
    links: ["Live contests", "Challenges", "Leaderboard", "Past seasons"],
  },
  { title: "Community", links: ["Discord", "Forum", "Blog", "Contributors"] },
  { title: "Company", links: ["About", "Careers", "Contact", "Press kit"] },
];

const socialIcons: IconType[] = [FaGithub, FaTwitter, FaLinkedin];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-800">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-linear-to-br from-orange-500 to-orange-700 text-ink-950">
                <Swords className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-bold text-white">
                Dev<span className="text-orange-500">Warriors</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              The arena for developers who want to test, prove, and sharpen
              their craft through contests and challenges.
            </p>
            <div className="mt-5 flex gap-3">
              {[FaGithub, FaTwitter, FaLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:text-white hover:border-white/20"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 transition hover:text-slate-200"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-slate-600">
            © 2026 Dev Warriors. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-400">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-400">
              Terms
            </a>
            <a href="#" className="hover:text-slate-400">
              Code of conduct
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
