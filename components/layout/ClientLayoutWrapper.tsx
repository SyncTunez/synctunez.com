'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import FloatingSidebarTrigger from "@/components/FloatingSidebarTrigger";
import PageContainer from '@/components/layout/page-container';
import ClientRegisterModalWrapper from '@/components/layout/ClientRegisterModalWrapper';

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
  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex min-h-svh w-full">
          <AppSidebar/>
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
} 