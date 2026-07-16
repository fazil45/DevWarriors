"use client";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Contests from "../components/Contests";
import Challenges from "../components/Challenges";
import Leaderboard from "../components/Leaderboard";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import RoleModal from "../components/RoleModal";
import { useModal } from "../store/showModal";

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
          <Hero />
          <Contests />
          <Challenges />
          <Leaderboard />
          <HowItWorks />
          <CTA />
        </main>
      </div>
      <div className={`${showModal ? "hidden" : "block"}`}>
        <Footer />
      </div>
    </div>
  );
}
