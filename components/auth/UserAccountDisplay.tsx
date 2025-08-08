"use client"

import React, { useContext } from "react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {SidebarMenuButton} from "@/components/ui/sidebar";
import {UserContext} from "@/components/auth/UserContext";
import {IconBell, IconCreditCard, IconLogout, IconLogout2, IconUserCircle} from "@tabler/icons-react";
import {UserAvatarProfile} from "@/components/ui/user-avatar-profile";
import Link from "next/link";
import { ChevronsUpDown } from "lucide-react";

export function UserAccountDisplay() {
    const userContext = useContext(UserContext);

    console.log("User Context", userContext);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        size='lg'
                        className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                    >
                        <UserAvatarProfile
                            className='h-8 w-8 rounded-lg'
                            showInfo
                            username={userContext?.userAccount.username}
                            profilePicture={userContext?.userAccount.profilePicture}
                        />
                        <ChevronsUpDown className='ml-auto size-4' />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                    side='bottom'
                    align='end'
                    sideOffset={4}
                >
                    <DropdownMenuLabel className='p-0 font-normal'>
                        <div className='px-1 py-1.5'>
                            <UserAvatarProfile
                                className='h-8 w-8 rounded-lg'
                                showInfo
                                username={userContext?.userAccount.username}
                                profilePicture={userContext?.userAccount.profilePicture}
                            />
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href="/api/profile">
                                <IconUserCircle className='mr-2 h-4 w-4' />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/api/notifications">
                                <IconBell className='mr-2 h-4 w-4' />
                                Notifications
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <a href="/api/logout">
                            <IconLogout2 className='mr-2 h-4 w-4' />
                            Sign Out
                        </a>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
} 