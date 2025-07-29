import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSolutionSection } from "@/components/sections/ProblemSolutionSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <ProblemSolutionSection />
      <BenefitsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}