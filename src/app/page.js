import BackgroundAnimation from "./_components/BackgroundAnimation";
import NavBar from "./_components/NavBar";
import Header from "./_components/Header";
import StatsSection from "./_components/StatsSection";
import ArchitectureSection from "./_components/ArchitectureSection";
import CtaSection from "./_components/CtaSection";
import TrustSection from "./_components/TrustSection";

export default function Home() {
  return (
    <>
            <Header />
            <StatsSection />
            <ArchitectureSection />
            <CtaSection />
            <TrustSection />
    </>
  );
}