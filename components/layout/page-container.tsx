'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
  constrained?: boolean;
}

export default function PageContainer({
  children,
  scrollable = true,
  className,
  constrained = false
}: PageContainerProps) {
  const content = (
    <div 
      className={cn(
        "min-h-[100dvh] w-full h-full",
        constrained && "max-w-[100rem] mx-auto px-4 md:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );

  if (!scrollable) {
    return content;
  }

  return (
    <ScrollArea className="h-[100dvh] w-full">
      {content}
    </ScrollArea>
  );
}