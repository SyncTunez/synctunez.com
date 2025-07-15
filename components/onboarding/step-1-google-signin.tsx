'use client';

import { Button } from "@/components/ui/button";
import { buildUrl } from "@/lib/api/apiClient";
import { useContext } from "react";
import { UserContext, UserContextType } from "@/components/auth/UserContext";
import { OnboardingLayout } from "./onboarding-layout";
import { OnboardingCard } from "./onboarding-card";

interface Step1GoogleSignInProps {
  onNext: () => void;
}

export function Step1GoogleSignIn({ onNext }: Step1GoogleSignInProps) {
  const userContext = useContext(UserContext) as UserContextType | null;
  const isSignedIn = !!userContext?.userAccount;

  const GoogleIcon = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  return (
    <OnboardingLayout>
      <OnboardingCard
        icon={<GoogleIcon />}
        title="Create Your Account"
        description="Sign in with Google to get started with SyncTunez"
      >
        {!isSignedIn ? (
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-card/80 hover:bg-card text-foreground border border-muted-foreground/20 hover:border-muted-foreground/40 px-8 py-6 h-auto text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <a href={buildUrl("/login")}>
                <GoogleIcon />
                <span className="ml-3">Sign in with Google</span>
              </a>
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-card/80 rounded-full flex items-center justify-center mx-auto border border-muted-foreground/20">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Welcome, {userContext.userAccount.username}!</h3>
                <p className="text-muted-foreground mt-1">You're successfully signed in to SyncTunez</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={onNext}
                size="lg"
                className="bg-card/80 hover:bg-card text-foreground border border-muted-foreground/20 hover:border-muted-foreground/40 px-8 py-6 h-auto text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Continue to Next Step
              </Button>
            </div>
          </>
        )}
      </OnboardingCard>
    </OnboardingLayout>
  );
} 