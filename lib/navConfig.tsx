import { IconHome, IconUser, IconPlaylist, IconCreditCard } from "@tabler/icons-react";
import type { ReactNode } from "react";

export type NavPage = {
  label: string;
  path: string;
  icon?: ReactNode;
  requiresAuth?: boolean;
  children?: NavPage[];
};

export const NAV_PAGES: NavPage[] = [
  {
    label: "Home",
    path: "/",
    icon: <IconHome size={20} />,
    requiresAuth: false,
  },
  {
    label: "Playlists",
    path: "/account",
    icon: <IconPlaylist size={20} />,
    requiresAuth: true,
  },
  {
    label: "Account",
    path: "/",
    icon: <IconUser size={20} />,
    requiresAuth: true,
    children: [
      {
        label: "Billing",
        path: "/account?tab=billing",
        icon: <IconCreditCard size={20} />,
        requiresAuth: true,
      },
    ],
  }
]; 