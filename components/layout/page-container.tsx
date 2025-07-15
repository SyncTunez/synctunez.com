import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <div className="w-full flex flex-col flex-1">
      {scrollable ? (
        <ScrollArea className='h-[calc(100dvh-52px)] w-full'>
          {children}
        </ScrollArea>
      ) : (
        children
      )}
    </div>
  );
}