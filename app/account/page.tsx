import React from "react";
import SecureContentWrapper from "@/components/SecureContentWrapper";
import { Button } from "@/components/ui/button";
import AccountContent from "./AccountContent";
import {buildUrl} from "@/lib/api/apiClient";

export default function AccountPage() {
  return (

    <SecureContentWrapper
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-semibold mb-2">Sign in required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to view your account details.</p>
          <Button asChild>
            <a href={buildUrl("/login")}>Sign In</a>
          </Button>
        </div>
      }
    >
      <AccountContent />
    </SecureContentWrapper>
  );
} 