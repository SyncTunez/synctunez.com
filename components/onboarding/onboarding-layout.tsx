'use client';

import { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
} 