'use client';

import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSolutionSection } from "@/components/sections/ProblemSolutionSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <ProblemSolutionSection />
      <BenefitsSection />
    </div>
  );
}