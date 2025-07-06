"use client"

import { useContext } from "react";
import { UserContext, UserContextType } from "@/app/api/UserContext";

export function useUserData(): UserContextType | null {
    const context = useContext(UserContext);
    return context;
} 