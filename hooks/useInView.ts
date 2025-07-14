import { useEffect, useRef, useState } from 'react';

export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once it's been seen, we can stop observing
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.05, // Trigger when at least 5% of the element is visible
        rootMargin: '10px', // Start animation when closer to the viewport
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  return { ref, isInView };
} 