'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export function FloatingUpArrow() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('benefits');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      // Show when we've scrolled halfway through the section
      const scrollProgress = (window.innerHeight - rect.top) / rect.height;
      setIsVisible(scrollProgress >= 0.5);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-12 h-12">
      <Button
        variant="default"
        className={`w-full h-full rounded-full bg-[#0f766e]/80 hover:bg-[#0f766e]/95 text-white shadow-xl hover:scale-110 transition-all duration-300
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp className="h-6 w-6" />
        <span className="sr-only">Scroll to top</span>
      </Button>
    </div>
  );
} 