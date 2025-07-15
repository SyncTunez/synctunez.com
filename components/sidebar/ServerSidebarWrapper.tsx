import SecureContentWrapper from "@/components/SecureContentWrapper";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import React from "react";

export default function ServerSidebarWrapper() {
  return (
    <SecureContentWrapper
      fallback={<AppSidebar/>}
    >
      <AppSidebar/>
    </SecureContentWrapper>
  );
} 