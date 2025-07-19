import { cookies } from "next/headers";
import React, { ReactNode } from "react";
import SecureContent from "./SecureContent";
import { UserAccount, UserAccountProps } from "@/lib/api/types";

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
            console.log('UserAccount cookie raw value:', userAccountRaw);
            userAccount = JSON.parse(userAccountRaw) as UserAccountProps;
            console.log('Parsed userAccount:', userAccount);
        } else {
            console.log('UserAccount cookie is null or undefined');
        }
    } catch (error) {
        console.error('Failed to parse UserAccount cookie:', error);
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