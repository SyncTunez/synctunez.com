'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export function FloatingDownArrow() {
  const [isVisible, setIsVisible] = useState(false);
  const [nextSectionId, setNextSectionId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('problems-solutions');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      // Show when we've scrolled halfway through the section, matching the up arrow
      const scrollProgress = (window.innerHeight - rect.top) / rect.height;
      setIsVisible(scrollProgress >= 0.5);
      
      // Set the next section ID to 'benefits' section
      setNextSectionId('benefits');
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (!nextSectionId) return;
    const nextSection = document.getElementById(nextSectionId);
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-12 h-12">
      <Button
        variant="default"
        className={`w-full h-full rounded-full bg-[#0f766e]/80 hover:bg-[#0f766e]/95 text-white shadow-xl hover:scale-110 transition-all duration-300
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        onClick={handleClick}
      >
        <ArrowDown className="h-6 w-6" />
        <span className="sr-only">Scroll to benefits section</span>
      </Button>
    </div>
  );
} 