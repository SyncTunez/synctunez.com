"use client";

import { createContext } from "react";
import {UserAccountProps} from "@/lib/api/types";

export interface UserContextType {
    userAccount: UserAccountProps;
    userSession: string;
}

export const UserContext = createContext<UserContextType | null>(null);