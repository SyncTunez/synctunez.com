import {Calendar, ChevronUp, Home, Inbox, Search, Settings, User2} from "lucide-react"

import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Button} from "@/components/ui/button";
import { IconBrandGoogleFilled } from '@tabler/icons-react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {AppHeaderContent} from "@/components/sidebar/app-header-content";
import Link from "next/link";
import SecureContentWrapper from "@/components/SecureContentWrapper";
import {buildUrl} from "@/lib/api/apiClient";
import {UserAccountDisplay} from "@/components/auth/UserAccountDisplay";

// Menu items.
const items = [
    {
        title: "Home",
        url: "",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible={"icon"}>
            <SidebarHeader>
                <AppHeaderContent/>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SecureContentWrapper fallback={<>
                            <Button asChild variant="outline" size="sm" className="w-full justify-center">
                                <Link href={buildUrl("/login")}>
                                    <IconBrandGoogleFilled className="mr-2 h-4 w-4" />
                                    Login
                                </Link>
                            </Button>
                        </>}>
                            <UserAccountDisplay />
                        </SecureContentWrapper>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}