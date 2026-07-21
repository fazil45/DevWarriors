"use client";
import Hero from "../components/LandingPage/Hero";
import Contests from "../components/Contests";
import Challenges from "../components/Challenges";
import Leaderboard from "../components/LandingPage/Leaderboard";
import HowItWorks from "../components/LandingPage/HowItWorks";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/Footer";
import RoleModal from "../components/Modal/RoleModal";
import { useModal } from "../store/showModal";
import SubmissionResultModal from "../components/Modal/ResultModal";

export default function Home() {
  const { showModal } = useModal();
  return (
    <div className="min-h-screen bg-neutral-900 scrollbar-none scroll-auto">
      <div className="pointer-events-none fixed left-0 top-1 h-75 w-150 -translate-x-1/2 rounded-full bg-blue-500/30 blur-[350px]" />
      <div className="pointer-events-none fixed right-0 top-1 h-75 w-150 -translate-x-1/2 rounded-full bg-blue-500/30 blur-[350px]" />
      <div
        className={`z-100 w-full h-full flex items-center justify-center ${showModal ? "flex" : "hidden"}`}
      >
        <RoleModal />
      </div>
      <div className={`${showModal ? "hidden" : "block"}`}>
        <main>
          <div>
            <Hero />
          </div>
          <div>
            <Contests />
          </div>
          <div>
            <Challenges />
          </div>
          <div>
            <Leaderboard />
          </div>
          <div>
            <HowItWorks />
          </div>
          <div>
            <CTA />
          </div>
        </main>
      </div>
      <div className={`${showModal ? "hidden" : "block"}`}>
        <Footer />
      </div>
    </div>
  );
}
