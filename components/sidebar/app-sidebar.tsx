import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
    SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, useSidebar, SidebarTrigger, SidebarSeparator
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
    IconBell,
    IconBrandGoogleFilled,
    IconChevronRight,
    IconChevronsDown,
    IconLogout2,
    IconUserCircle
} from "@tabler/icons-react";
import { AppHeaderContent } from "@/components/sidebar/app-header-content";
import Link from "next/link";
import SecureContentWrapper from "@/components/SecureContentWrapper";
import { buildUrl } from "@/lib/api/apiClient";
import { UserAccountDisplay } from "@/components/auth/UserAccountDisplay";
import { NAV_PAGES } from "@/lib/navConfig";
import {
    Collapsible, CollapsibleContent, CollapsibleTrigger
} from "@/components/ui/collapsible";
import {cookies} from "next/headers";
import {cn} from "@/lib/utils";
import {RegisterButton} from "@/components/sidebar/RegisterButton";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {UserAvatarProfile} from "@/components/ui/user-avatar-profile";
import React from "react";
import {SideBarToggle} from "@/components/sidebar/SideBarToggle";

export function AppSidebar() {

    const renderNavIcons = (filterAuthed: boolean) =>
        NAV_PAGES
            .filter(item => !filterAuthed || !item.requiresAuth)
            .map(item => {
                let children: typeof item.children = [];
                if (Array.isArray(item.children)) {
                    children = item.children.filter(child => !filterAuthed || !child.requiresAuth);
                }
                const hasVisibleChildren = children.length > 0;

                if (item.children && hasVisibleChildren) {
                    return (
                        <Collapsible
                            key={item.label}
                            defaultOpen
                            asChild
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <button
                                        className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-5 [&>svg]:shrink-0 h-10 text-base font-medium min-w-8 duration-200 ease-linear"
                                        aria-label={item.label}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                        <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 h-5 w-5"/>
                                    </button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pl-4">
                                    {children.map((child) => (
                                        <SidebarMenuItem key={child.label}>
                                            <Link
                                                href={child.path}
                                                className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-5 [&>svg]:shrink-0 h-10 text-base font-medium min-w-8 duration-200 ease-linear"
                                                aria-label={child.label}
                                            >
                                                {child.icon}
                                                <span>{child.label}</span>
                                            </Link>
                                        </SidebarMenuItem>
                                    ))}
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                }

                return (
                    <SidebarMenuItem key={item.label}>
                        <Link
                            href={item.path}
                            className={"peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-5 [&>svg]:shrink-0 h-10 text-base font-medium min-w-8 duration-200 ease-linear"}
                            aria-label={item.label}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuItem>
                );
            })
            .filter(Boolean);

    return (
        <Sidebar collapsible="icon">
            <div className="flex flex-col h-full min-h-svh">
                <SidebarHeader>
                    <AppHeaderContent/>
                </SidebarHeader>

                <div className="px-4 py-2">
                    <SidebarSeparator />
                </div>

                <SidebarContent className="flex-1">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SecureContentWrapper fallback={renderNavIcons(true)}>
                                    {renderNavIcons(false)}
                                </SecureContentWrapper>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="mt-auto">
                    <div className="px-4 py-2">
                        <SidebarSeparator />
                    </div>
                    <SidebarMenu>
                        <SidebarMenuItem className="py-3 md:py-2">
                            <DropdownMenu>
                                <DropdownMenuContent
                                    className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                                    side='bottom'
                                    align='end'
                                    sideOffset={4}
                                >
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <SecureContentWrapper
                                fallback={
                                    <RegisterButton/>
                                }
                            >
                                <UserAccountDisplay/>
                            </SecureContentWrapper>
                            <div className="h-3" />
                            <SideBarToggle/>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </div>
        </Sidebar>
    );
}
