'use client';

import * as React from 'react'
import {
  SidebarMenu,
  useSidebar
} from '@/components/ui/sidebar'
import {ModeToggle} from "@/components/ui/themetoggle";
import { WindowIcon } from '@/components/ui/window-icon';
import { SideBarToggle } from './SideBarToggle';

export function AppHeaderContent() {
  const [mounted, setMounted] = React.useState(false);
  const { open } = useSidebar();
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarMenu>
      <div className="flex flex-col gap-2 pt-3">
        <div
          className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm h-8 text-sm min-w-8"
          aria-label="Sidebar Header"
        >
          {!open && (
            <div className='w-full flex justify-center'>
              <div className='text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <WindowIcon />
              </div>
            </div>
          )}
          {open && (
            <>
              <div className='text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <WindowIcon />
              </div>
              <div className='grid flex-1 text-left leading-tight'>
                <span className='truncate font-bold text-lg'>SyncTunez</span>
              </div>
              <div className="flex items-center gap-2">
                {mounted ? <ModeToggle /> : null}
                <SideBarToggle />
              </div>
            </>
          )}
        </div>
        {!open && (
          <div className="w-full flex justify-center px-2">
            <SideBarToggle />
          </div>
        )}
      </div>
    </SidebarMenu>
  )
}
