'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface AnimatedBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedBadge({ children, className }: AnimatedBadgeProps) {
  return (
    <div className={cn(
      'relative p-2 bg-[#252b3b] rounded-md text-center overflow-hidden',
      'animate-[pulse_3s_ease-in-out_infinite]',
      'before:absolute before:inset-0',
      'before:bg-gradient-to-r before:from-[#0f766e]/0 before:via-[#0f766e]/20 before:to-[#0f766e]/0',
      'before:animate-[shimmer_2s_ease-in-out_infinite]',
      className
    )}>
      <div className="relative flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 text-[#0f766e] animate-[bounce_2s_ease-in-out_infinite]" />
        {children}
      </div>
    </div>
  );
} 