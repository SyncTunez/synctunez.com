import { cookies } from 'next/headers';
import { UserAccountProps } from '@/lib/api/schemas';

export interface UserSession {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
  connectionId?: string;
  connectionType?: string;
}

export async function getAuthData(): Promise<{
  userSession: UserSession | null;
  userAccount: UserAccountProps | null;
}> {
  try {
    const cookieStore = await cookies();
    const userSessionRaw = cookieStore.get('UserSession')?.value;
    const userAccountRaw = cookieStore.get('UserAccount')?.value;

    let userSession: UserSession | null = null;
    let userAccount: UserAccountProps | null = null;

    if (userSessionRaw) {
      userSession = JSON.parse(userSessionRaw) as UserSession;
    }

    if (userAccountRaw) {
      userAccount = JSON.parse(userAccountRaw) as UserAccountProps;
    }

    return { userSession, userAccount };
  } catch (error) {
    console.error('Error parsing auth data:', error);
    return { userSession: null, userAccount: null };
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const { userSession, userAccount } = await getAuthData();
  return !!(userSession && userAccount);
}

export async function requireAuth(): Promise<{
  userSession: UserSession;
  userAccount: UserAccountProps;
}> {
  const { userSession, userAccount } = await getAuthData();
  
  if (!userSession || !userAccount) {
    throw new Error('Authentication required');
  }

  return { userSession, userAccount };
} 