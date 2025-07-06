"use client";

import React, { ReactNode } from "react";
import {UserAccountProps} from "@/lib/api/types";
import {UserContext} from "@/components/auth/UserContext";
interface SecureContentProps {
    userSession: string | null;
    userAccount: UserAccountProps | null;
    fallback: ReactNode;
    children: ReactNode;
}

const SecureContent: React.FC<SecureContentProps> = ({
                                                         userSession,
                                                         userAccount,
                                                         fallback,
                                                         children,
                                                     }) => {
    if (userSession && userAccount) {
        return (
            <UserContext.Provider value={{ userSession, userAccount }}>
                {children}
            </UserContext.Provider>
        );
    }

    return <>{fallback}</>;
};

export default SecureContent;