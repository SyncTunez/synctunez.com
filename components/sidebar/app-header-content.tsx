import * as React from 'react'
import {
  SidebarMenu,
  SidebarMenuButton, SidebarTrigger,
} from '@/components/ui/sidebar'
import {ModeToggle} from "@/components/ui/themetoggle";
import { WindowIcon } from '@/components/ui/window-icon';
import {PanelLeftIcon} from "lucide-react";

export function AppHeaderContent() {

  return (
    <SidebarMenu>
      <SidebarMenuButton size='lg'>
        <div className='text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
          <WindowIcon />
        </div>
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>SyncTunez</span>
        </div>

        <ModeToggle></ModeToggle>
      </SidebarMenuButton>
    </SidebarMenu>
  )
}
