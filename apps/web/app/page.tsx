import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Contests from "../components/Contests";
import Challenges from "../components/Challenges";
import Leaderboard from "../components/Leaderboard";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
     <div className="min-h-screen bg-ink-950">
      <Navbar />
      <main>
        <Hero />
        <Contests />
        <Challenges />
        <Leaderboard />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
