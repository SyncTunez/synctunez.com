'use client';

import { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
}

export function OnboardingLayout({ children, currentStep }: OnboardingLayoutProps) {
  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex items-center py-16 md:py-20">
      <div className="w-full max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
} 