'use client';

import { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="w-full flex-1 flex items-center justify-center py-8">
      {children}
    </div>
  );
} 