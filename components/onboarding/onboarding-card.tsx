'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface OnboardingCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

export function OnboardingCard({ icon, title, description, children }: OnboardingCardProps) {
  return (
    <Card className="bg-muted shadow-lg border border-muted-foreground/10 relative">
      {/* Icon */}
      {icon && (
        <div className="absolute -top-12 sm:-top-10 left-1/2 -translate-x-1/2 z-10">
          <div className="w-24 h-24 sm:w-20 sm:h-20 bg-card/80 rounded-full flex items-center justify-center shadow-lg border border-muted-foreground/20">
            {icon}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="pt-20 sm:pt-16 pb-12 px-4 sm:px-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          {description}
        </p>
        
        <div className="space-y-8">
          {children}
        </div>
      </div>
    </Card>
  );
} 