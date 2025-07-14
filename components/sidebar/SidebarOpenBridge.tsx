"use client";
import { useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { UserAccountProps } from "@/lib/api/types";

export default function SidebarOpenBridge({ userSession, userAccount }: { userSession: string | null, userAccount: UserAccountProps | null }) {
  const { open } = useSidebar();
  return <AppSidebar open={open} userSession={userSession} userAccount={userAccount} />;
} 