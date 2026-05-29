import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { SubjectsPreview } from "@/components/home/SubjectsPreview";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] font-inter">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <SubjectsPreview />
      <CTASection />
    </main>
  );
}
