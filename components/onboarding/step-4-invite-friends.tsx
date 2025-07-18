'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconUserPlus, IconShare, IconCopy, IconCheck, IconMail, IconBrandTwitter, IconQrcode, IconBrandFacebook } from "@tabler/icons-react";
import { useState, useContext } from "react";
import { UserContext, UserContextType } from "@/components/auth/UserContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "./onboarding-layout";
import { OnboardingCard } from "./onboarding-card";

interface Step4InviteFriendsProps {
  onComplete: () => void;
}

export function Step4InviteFriends({ onComplete }: Step4InviteFriendsProps) {
  const userContext = useContext(UserContext) as UserContextType | null;
  const [email, setEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const shareUrl = `${window.location.origin}/invite/${userContext?.userAccount?.username || 'demo'}`;
  const shareText = `Check out SyncTunez! Let's sync our music playlists and find songs we both love. Join me at ${shareUrl}`;

  const handleSendInvite = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    // Simulate sending invite
    setTimeout(() => {
      setInviteSent(true);
      toast.success(`Invitation sent to ${email}`);
      setEmail("");
    }, 1000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareQRCode = () => {
    // TODO: Implement QR code generation and display
    toast.info("QR Code sharing coming soon!");
  };

  const handleFinish = () => {
    toast.success("Welcome to SyncTunez! 🎵");
    router.push("/account");
  };

  const FriendIcon = () => (
    <div className="w-20 h-20 bg-gradient-to-r from-[#0f766e] to-[#14b8a6] rounded-full flex items-center justify-center shadow-lg">
      <IconUserPlus className="w-10 h-10 text-white" />
    </div>
  );

  return (
    <OnboardingLayout currentStep={4}>
      <OnboardingCard
        icon={<FriendIcon />}
        title="Invite Your Friends"
        description="The fun begins when you sync playlists with friends"
      >

          {/* Email Invite */}
          <div className="space-y-4">
            <Label htmlFor="email" className="text-base font-medium text-foreground">Send Email Invitation</Label>
            <div className="flex space-x-3">
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 text-base bg-card/80 border-muted-foreground/20 text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={handleSendInvite}
                variant="outline"
                size="lg"
                className="px-8 h-12 bg-card/80 border-muted-foreground/20 text-foreground hover:bg-card hover:border-muted-foreground/40"
              >
                <IconMail className="w-5 h-5 mr-2" />
                Send
              </Button>
            </div>
          </div>

          {inviteSent && (
            <div className="bg-card/80 rounded-lg p-4 border border-muted-foreground/20">
              <div className="flex items-center space-x-3">
                <IconCheck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Invitation sent!</p>
                  <p className="text-sm text-muted-foreground mt-1">Your friend will receive an email with instructions to join</p>
                </div>
              </div>
            </div>
          )}

          {/* Share Options */}
          <div className="space-y-4">
            <Label className="text-base font-medium text-foreground">Or share your invite link</Label>
            <div className="flex space-x-3">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 bg-card/80 h-12 text-base border-muted-foreground/20 text-foreground"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="lg"
                className="px-6 h-12 bg-card/80 border-muted-foreground/20 text-foreground hover:bg-card hover:border-muted-foreground/40"
              >
                {copied ? <IconCheck className="w-5 h-5" /> : <IconCopy className="w-5 h-5" />}
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {/* X Button - Authentic X branding */}
              <Button
                onClick={handleShareTwitter}
                size="lg"
                className="h-12 bg-black hover:bg-gray-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5 md:mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="hidden md:inline">Share on X</span>
              </Button>
              
              {/* Facebook Button - Authentic Facebook branding */}
              <Button
                onClick={handleShareFacebook}
                size="lg"
                className="h-12 bg-[#1877F2] hover:bg-[#166fe5] text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5 md:mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="hidden md:inline">Share on Facebook</span>
              </Button>
              
              {/* QR Code Button - New */}
              <Button
                onClick={handleShareQRCode}
                variant="outline"
                size="lg"
                className="h-12 bg-card/80 border-muted-foreground/20 text-foreground hover:bg-card hover:border-muted-foreground/40 hover:text-black dark:hover:text-foreground"
              >
                <IconQrcode className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">QR Code</span>
              </Button>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-sm text-muted-foreground text-center">
            You can invite friends anytime, don't worry if no one joins right now!
          </p>

          
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleFinish}
              size="lg"
              className="relative text-lg px-8 py-6 h-auto bg-gradient-to-r from-[#0f766e] via-[#0d9488] to-[#14b8a6] hover:from-[#0d9488] hover:via-[#14b8a6] hover:to-[#0f766e] text-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#134e4a]/25 hover:scale-[1.02] transition-all duration-200 font-semibold overflow-hidden
                [background-size:200%_200%]
                animate-[gradientMove_3s_ease-in-out_infinite]
                before:absolute before:inset-0
                before:bg-gradient-to-r before:from-white/0 before:via-white/25 before:to-white/0
                before:translate-x-[-200%]
                before:animate-[shimmer_2s_ease-in-out_infinite]
                before:skew-x-[-20deg]
                before:w-[75%]"
            >
              <span className="relative flex items-center">
                <span>🎧</span>
                <span className="ml-2">Start Syncing</span>
              </span>
            </Button>
          </div>
        </OnboardingCard>
      </OnboardingLayout>
    );
} 