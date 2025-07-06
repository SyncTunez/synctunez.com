import { cookies } from "next/headers";
import React, { ReactNode } from "react";
import SecureContent from "./SecureContent";
import { UserAccount, UserAccountProps } from "@/app/api/UserAccount";

interface SecureContentWrapperProps {
    fallback: ReactNode;
    children: ReactNode;
}

export default async function SecureContentWrapper({
                                                 fallback,
                                                 children,
                                             }: SecureContentWrapperProps) {
    // Read cookies on server
    const cookieStore = await cookies();
    const userSession = cookieStore.get("UserSession")?.value ?? null;
    const userAccountRaw = cookieStore.get("UserAccount")?.value ?? null;

    let userAccount: UserAccountProps | null = null;
    try {
        if (userAccountRaw) {
            userAccount = JSON.parse(userAccountRaw) as UserAccountProps;
        }
    } catch {
        userAccount = null;
    }

    return (
        <SecureContent
            userSession={userSession}
            userAccount={userAccount}
            fallback={fallback}
        >
            {children}
        </SecureContent>
    );
}