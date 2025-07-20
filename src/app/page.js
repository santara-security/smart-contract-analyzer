import BackgroundAnimation from "./_components/BackgroundAnimation";
import NavBar from "./_components/NavBar";
import HeroSection from "./_components/HeroSection";
import SecurityStats from "./_components/SecurityStats";
import SecurityFeatures from "./_components/SecurityFeatures";
import AnalysisWorkflow from "./_components/AnalysisWorkflow";
import SecurityTrust from "./_components/SecurityTrust";
import CtaSection from "./_components/CtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SecurityStats />
      <SecurityFeatures />
      <AnalysisWorkflow />
      <SecurityTrust />
      <CtaSection />
    </>
  );
}