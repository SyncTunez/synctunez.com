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
                                    <SidebarMenuButton tooltip={item.label}
                                                       className="min-w-8 duration-200 ease-linear">
                                        {item.icon}
                                        <span>{item.label}</span>
                                        <IconChevronRight
                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {children.map(sub => (
                                            <SidebarMenuSubItem key={sub.label}>
                                                <SidebarMenuSubButton asChild>
                                                    <a href={sub.path}>
                                                        <span>{sub.label}</span>
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                }

                return (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild tooltip={item.label} className="min-w-8 duration-200 ease-linear">
                            <a href={item.path}>
                                {item.icon}
                                <span>{item.label}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })
            .filter(Boolean);

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <AppHeaderContent/>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SecureContentWrapper fallback={renderNavIcons(true)}>
                                {renderNavIcons(false)}
                            </SecureContentWrapper>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
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
        </Sidebar>
    );
}
