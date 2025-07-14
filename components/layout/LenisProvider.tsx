'use client';

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

export function LenisProvider({
  children,
  options = {}
}: {
  children: React.ReactNode;
  options?: {
    duration?: number;
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
  };
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
      smoothWheel: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      syncTouch: false,
      ...options
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [options]);

  return children;
} 