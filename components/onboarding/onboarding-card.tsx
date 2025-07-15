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
    <Card className="bg-muted shadow-lg border border-muted-foreground/10 relative mx-4">
      {/* Icon */}
      {icon && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10">
          <div className="w-20 h-20 bg-card/80 rounded-full flex items-center justify-center shadow-lg border border-muted-foreground/20">
            {icon}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="pt-16 pb-12 px-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-3">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </Card>
  );
} 