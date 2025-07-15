'use client';

import { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex items-center py-16 md:py-20">
      <div className="w-full max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
} 