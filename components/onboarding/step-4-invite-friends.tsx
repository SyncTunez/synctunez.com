'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconUserPlus, IconShare, IconCopy, IconCheck, IconMail, IconBrandTwitter } from "@tabler/icons-react";
import { useState, useContext } from "react";
import { UserContext, UserContextType } from "@/components/auth/UserContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

  const handleFinish = () => {
    toast.success("Welcome to SyncTunez! 🎵");
    router.push("/account");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <Card className="bg-muted shadow-lg border border-muted-foreground/10 relative overflow-hidden">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card/80 text-foreground px-4 py-2 rounded-full text-sm font-medium border border-muted-foreground/20 z-10">
          SyncTunez
        </div>
        <CardHeader className="text-center pb-6 pt-10">
          <div className="w-20 h-20 bg-gradient-to-r from-[#0f766e] to-[#14b8a6] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <IconUserPlus className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Invite Your Friends
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
            The fun begins when you sync playlists with friends
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 px-8 pb-8">

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
                className="px-8 h-12 bg-card/80 border-muted-foreground/20 text-foreground hover:bg-card hover:border-muted-foreground/40"
              >
                {copied ? <IconCheck className="w-5 h-5" /> : <IconCopy className="w-5 h-5" />}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleShareTwitter}
                variant="outline"
                size="lg"
                className="h-12 bg-card/80 border-muted-foreground/20 text-foreground hover:bg-card hover:border-muted-foreground/40"
              >
                <IconBrandTwitter className="w-5 h-5 mr-2" />
                Share on Twitter
              </Button>
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="lg"
                className="h-12 bg-card/80 border-muted-foreground/20 text-foreground hover:bg-card hover:border-muted-foreground/40"
              >
                <IconShare className="w-5 h-5 mr-2" />
                Share Link
              </Button>
            </div>
          </div>

          {/* Completion */}
          <div className="bg-card/80 rounded-lg p-4 border border-muted-foreground/20">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-card rounded-full flex items-center justify-center mt-0.5 border border-muted-foreground/20">
                <svg className="w-3 h-3 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-foreground">You can invite friends anytime</h4>
                <p className="text-sm text-muted-foreground mt-1">Don't worry if no one joins right now - you can always invite more friends later from your account page.</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleFinish}
              size="lg"
              className="bg-card/80 hover:bg-card text-foreground border border-muted-foreground/20 hover:border-muted-foreground/40 px-8 py-6 h-auto text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Complete Setup & Start Syncing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 