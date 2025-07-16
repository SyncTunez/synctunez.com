'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export function FloatingDownArrow() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('problems-solutions');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      
      // Show when the section is at the bottom of the viewport
      // and hide when we start scrolling past it
      const bottomInView = rect.bottom <= window.innerHeight;
      const topStillVisible = rect.top > 0;
      
      setIsVisible(bottomInView && topStillVisible);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const nextSection = document.getElementById('benefits');
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