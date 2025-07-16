'use client';

import { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
}

export function OnboardingLayout({ children, currentStep }: OnboardingLayoutProps) {
  return (
    <div id="onboarding-layout" className="w-full min-h-[calc(100vh-8rem)] flex pt-8 md:pt-12">
      <div className="w-full max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
} 