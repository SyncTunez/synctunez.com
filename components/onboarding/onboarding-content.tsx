'use client';

import { useState, useContext, useEffect } from "react";
import { UserContext, UserContextType } from "@/components/auth/UserContext";
import { OnboardingProgress } from "@/components/ui/onboarding-progress";
import { Step1GoogleSignIn } from "@/components/onboarding/step-1-google-signin";
import { Step2SpotifyConnect } from "@/components/onboarding/step-2-spotify-connect";
import { Step3ChoosePlaylist } from "@/components/onboarding/step-3-choose-playlist";
import { Step4InviteFriends } from "@/components/onboarding/step-4-invite-friends";
import { useRouter } from "next/navigation";

const ONBOARDING_STEPS = [
  {
    title: "Sign In",
    description: "Create your account"
  },
  {
    title: "Connect",
    description: "Link your Spotify"
  },
  {
    title: "Import",
    description: "Choose a playlist"
  },
  {
    title: "Invite",
    description: "Add friends"
  }
];

export function OnboardingContent() {
  const userContext = useContext(UserContext) as UserContextType | null;
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(() => {
    // Calculate initial step based on user state
    if (!userContext?.userAccount) return 1;
    if (!userContext.userAccount.hasSpotify) return 2;
    return 3; // If user has both account and Spotify, start at step 3
  });
  
  // Update step when user context changes
  useEffect(() => {
    if (!userContext?.userAccount) {
      setCurrentStep(1);
    } else if (!userContext.userAccount.hasSpotify) {
      setCurrentStep(2);
    } else if (currentStep < 3) {
      setCurrentStep(3);
    }
  }, [userContext, currentStep]);

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleComplete = () => {
    // This is handled by the Step4InviteFriends component
    console.log('Onboarding completed');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1GoogleSignIn onNext={handleNext} />;
      case 2:
        return <Step2SpotifyConnect onNext={handleNext} />;
      case 3:
        return <Step3ChoosePlaylist onNext={handleNext} />;
      case 4:
        return <Step4InviteFriends onComplete={handleComplete} />;
      default:
        return <Step1GoogleSignIn onNext={handleNext} />;
    }
  };

  return (
    <div className="bg-[#134e4a]/5 flex flex-col min-h-screen w-full">
      {/* Progress indicator */}
      <div className="w-full py-6 flex-none">
        <div className="w-full max-w-6xl mx-auto px-4">
          <OnboardingProgress
            currentStep={currentStep}
            totalSteps={ONBOARDING_STEPS.length}
            steps={ONBOARDING_STEPS}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex w-full min-h-0">
        <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-center">
          {renderStep()}
        </div>
      </div>
    </div>
  );
} 