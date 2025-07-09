'use client';

import * as React from 'react'
import {
  SidebarMenu,
  // SidebarMenuButton, SidebarTrigger,
} from '@/components/ui/sidebar'
import {ModeToggle} from "@/components/ui/themetoggle";
import { WindowIcon } from '@/components/ui/window-icon';
import {PanelLeftIcon} from "lucide-react";

export function AppHeaderContent() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarMenu>
      <div
        className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-8 text-sm min-w-8 duration-200 ease-linear"
        tabIndex={0}
        role="button"
        aria-label="Sidebar Header"
      >
        <div className='text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
          <WindowIcon />
        </div>
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>SyncTunez</span>
        </div>
        {/* Reserve space for ModeToggle to prevent layout shift */}
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {mounted ? <ModeToggle /> : null}
        </div>
      </div>
    </SidebarMenu>
  )
}
