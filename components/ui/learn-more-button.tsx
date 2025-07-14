'use client';

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function LearnMoreButton() {
  return (
    <Button 
      variant="outline" 
      size="lg" 
      className="text-lg px-8 py-6 h-auto hover:scale-[1.02] transition-all duration-200"
      onClick={() => {
        document.getElementById('problems-solutions')?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      <Search className="mr-2 h-5 w-5" />
      Learn More
    </Button>
  );
} 