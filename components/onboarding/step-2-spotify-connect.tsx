'use client';

import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { UserContext, UserContextType } from "@/components/auth/UserContext";
import { OnboardingLayout } from "./onboarding-layout";
import { OnboardingCard } from "./onboarding-card";

interface Step2SpotifyConnectProps {
  onNext: () => void;
}

export function Step2SpotifyConnect({ onNext }: Step2SpotifyConnectProps) {
  const userContext = useContext(UserContext) as UserContextType | null;
  const isConnected = false; // Replace with actual Spotify connection status

  const SpotifyIcon = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24">
      <path
        fill="#1DB954"
        d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.24-3.021-1.851-6.822-2.271-11.292-1.241-.418.081-.837-.241-.918-.651-.082-.41.24-.837.63-.918 4.891-1.121 9.092-.63 12.452 1.451.369.241.49.721.229 1.119zm1.471-3.291c-.301.459-.921.63-1.381.319-3.461-2.131-8.731-2.75-12.842-1.511-.499.15-1.021-.15-1.171-.65-.15-.5.15-1.021.65-1.171 4.681-1.42 10.511-.721 14.472 1.771.449.301.629.92.272 1.242zm.129-3.409c-4.151-2.461-11.022-2.689-15.002-1.489-.619.19-1.271-.17-1.461-.79-.19-.619.17-1.271.79-1.461 4.581-1.389 12.192-1.121 17.001 1.729.561.33.74 1.051.41 1.61-.321.54-1.049.721-1.738.401z"
      />
    </svg>
  );

  return (
    <OnboardingLayout currentStep={2}>
      <OnboardingCard
        icon={<SpotifyIcon />}
        title="Connect Your Spotify"
        description="Link your Spotify account to start syncing your music"
      >
        {!isConnected ? (
          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white px-8 py-6 h-auto text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => {
                // Add Spotify connect logic here
              }}
            >
              <SpotifyIcon />
              <span className="ml-3">Connect Spotify Account</span>
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
                <h3 className="text-lg font-semibold text-foreground">Spotify Connected!</h3>
                <p className="text-muted-foreground mt-1">Your Spotify account is now linked to SyncTunez</p>
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