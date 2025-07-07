import { IconHome, IconUser, IconBrandSpotify, IconCreditCard } from "@tabler/icons-react";
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
    icon: <IconHome size={18} />,
    requiresAuth: false,
  },
  {
    label: "Account",
    path: "/",
    icon: <IconUser size={18} />,
    requiresAuth: true,
    children: [
      {
        label: "Overview",
        path: "/account",
        requiresAuth: true,
      },
      {
        label: "Billing",
        path: "/account?tab=billing",
        icon: <IconCreditCard size={18} />,
        requiresAuth: true,
      },
    ],
  }
]; 