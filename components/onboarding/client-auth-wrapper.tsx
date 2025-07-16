'use client';

import { useEffect, useState } from 'react';
import { UserContext } from '@/components/auth/UserContext';
import type { UserAccountProps } from '@/lib/api/types';

interface ClientAuthWrapperProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export function ClientAuthWrapper({ children, fallback }: ClientAuthWrapperProps) {
  const [userSession, setUserSession] = useState<string | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccountProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authentication data in cookies or localStorage
    const checkAuth = () => {
      try {
        // Try to get session from cookies
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        const sessionCookie = cookies['UserSession'];
        const accountCookie = cookies['UserAccount'];

        if (sessionCookie && accountCookie) {
          setUserSession(sessionCookie);
          try {
            const account = JSON.parse(decodeURIComponent(accountCookie));
            setUserAccount(account);
          } catch (error) {
            console.error('Failed to parse user account:', error);
            setUserAccount(null);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f766e]"></div>
      </div>
    );
  }

  if (userSession && userAccount) {
    return (
      <UserContext.Provider value={{ userSession, userAccount }}>
        {children}
      </UserContext.Provider>
    );
  }

  return <>{fallback}</>;
} 