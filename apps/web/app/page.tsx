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
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".fade-section");

    sections.forEach((section) => {
      gsap.from(section, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);
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
          <section className="fade-section">
            <Hero />
          </section>

          <section className="fade-section">
            <Contests />
          </section>

          <section className="fade-section">
            <Challenges />
          </section>

          <section className="fade-section">
            <Leaderboard />
          </section>

          <section className="fade-section">
            <HowItWorks />
          </section>

          <section className="fade-section">
            <CTA />
          </section>
        </main>
      </div>
      <div className={`${showModal ? "hidden" : "block"}`}>
        <Footer />
      </div>
    </div>
  );
}
