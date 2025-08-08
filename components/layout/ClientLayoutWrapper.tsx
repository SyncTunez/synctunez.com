'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import FloatingSidebarTrigger from "@/components/FloatingSidebarTrigger";
import PageContainer from '@/components/layout/page-container';
import ClientRegisterModalWrapper from '@/components/layout/ClientRegisterModalWrapper';
import type { UserAccountProps } from '@/lib/api/types';
import { ClientToaster } from '@/components/layout/Providers';
import { UserContext } from '@/components/auth/UserContext';

interface ClientLayoutWrapperProps {
  defaultOpen: boolean;
  userSession: string | null;
  userAccountRaw: string | null;
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({
  defaultOpen,
  userSession,
  userAccountRaw,
  children
}: ClientLayoutWrapperProps) {
  // Parse userAccountRaw to UserAccountProps
  let userAccount: UserAccountProps | null = null;
  if (userAccountRaw) {
    try {
      userAccount = JSON.parse(userAccountRaw) as UserAccountProps;
    } catch (error) {
      console.error('Failed to parse userAccountRaw:', error);
      userAccount = null;
    }
  }

  const content = (
    <>
      <ClientToaster />
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex min-h-svh w-full">
          <AppSidebar userSession={userSession} userAccount={userAccount} />
          <FloatingSidebarTrigger />
          <main className="flex-1 w-full">
            <PageContainer>
              {children}
            </PageContainer>
          </main>
        </div>
      </SidebarProvider>
      <ClientRegisterModalWrapper userSession={userSession} userAccountRaw={userAccountRaw}/>
    </>
  );

  // Only provide context when we have both session and account
  if (userSession && userAccount) {
    return (
      <UserContext.Provider value={{ userSession, userAccount }}>
        {content}
      </UserContext.Provider>
    );
  }

  return content;
} 