import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  if (!scrollable) {
    return children;
  }

  return (
    <div className="w-full h-[100dvh] flex flex-col overflow-hidden">
      <ScrollArea className='h-full w-full'>
        {children}
      </ScrollArea>
    </div>
  );
}