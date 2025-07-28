import { cookies } from 'next/headers';
import SecureContent from './SecureContent';
import type { UserAccountProps } from '@/lib/api/types';
import { captureComponentError, addBreadcrumb } from '@/lib/sentry';

interface SecureContentWrapperProps {
    fallback: React.ReactNode;
    children: React.ReactNode;
}

export default async function SecureContentWrapper({
                                                 fallback,
                                                 children,
                                             }: SecureContentWrapperProps) {
    // Read cookies on server
    const cookieStore = await cookies();
    const userSession = cookieStore.get("UserSession")?.value ?? null;
    const userAccountRaw = cookieStore.get("UserAccount")?.value ?? null;

    addBreadcrumb('SecureContentWrapper initialized', 'auth', {
        hasUserSession: !!userSession,
        hasUserAccountRaw: !!userAccountRaw
    });

    let userAccount: UserAccountProps | null = null;
    try {
        if (userAccountRaw) {
            userAccount = JSON.parse(userAccountRaw) as UserAccountProps;
            addBreadcrumb('UserAccount cookie parsed successfully', 'auth', {
                username: userAccount.username,
                hasSpotify: userAccount.hasSpotify,
                hasApple: userAccount.hasApple,
                hasYoutube: userAccount.hasYoutube,
                hasTidal: userAccount.hasTidal
            });
        }
    } catch (error) {
        captureComponentError(
            `Failed to parse UserAccount cookie: ${error instanceof Error ? error.message : String(error)}`,
            {
                component: 'SecureContentWrapper',
                action: 'parse_user_account_cookie',
                additionalData: {
                    userAccountRaw,
                    error: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined
                }
            },
            'error'
        );
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