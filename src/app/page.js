import HeroSection from "./_components/HeroSection";
import SecurityFeatures from "./_components/SecurityFeatures";
import AnalysisWorkflow from "./_components/AnalysisWorkflow";
import SecurityTrust from "./_components/SecurityTrust";
import CtaSection from "./_components/CtaSection";

export default function Home() {
  return (
    <>
      {/* Hero: clear message + two primary CTAs */}
      <HeroSection />

      {/* Core features: two primary ways to analyze */}
      <SecurityFeatures />

      {/* Compact workflow snapshot */}
      <AnalysisWorkflow />

      {/* Trust indicators / social proof */}
      <SecurityTrust />

      {/* Optional stats could be placed here if needed */}
      {/* <SecurityStats /> */}

      {/* Final CTA */}
      <CtaSection />
    </>
  );
}
