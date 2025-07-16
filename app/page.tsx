'use client';

import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSolutionSection } from "@/components/sections/ProblemSolutionSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { Footer } from "@/components/sections/Footer";
import Script from "next/script";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SyncTuneZ",
    "description": "Create collaborative playlists with friends by comparing and syncing your music preferences",
    "url": "https://synctunez.com",
    "applicationCategory": "MusicApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Playlist comparison",
      "Collaborative playlist creation",
      "Spotify integration",
      "Music discovery",
      "Friend sharing"
    ],
    "creator": {
      "@type": "Organization",
      "name": "SyncTuneZ"
    }
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="overflow-x-hidden">
        <HeroSection />
        <ProblemSolutionSection />
        <BenefitsSection />
        <Footer />
      </div>
    </>
  );
}