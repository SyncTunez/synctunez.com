import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { UserAccountProps } from "@/lib/api/types";

export default function SidebarOpenBridge({ userSession, userAccount }: { userSession: string | null, userAccount: UserAccountProps | null }) {
  return <AppSidebar />;
} 