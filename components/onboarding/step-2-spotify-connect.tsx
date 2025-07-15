'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconBrandSpotify } from "@tabler/icons-react";
import { buildUrl } from "@/lib/api/apiClient";
import { useContext } from "react";
import { UserContext, UserContextType } from "@/components/auth/UserContext";

interface Step2SpotifyConnectProps {
  onNext: () => void;
}

export function Step2SpotifyConnect({ onNext }: Step2SpotifyConnectProps) {
  const userContext = useContext(UserContext) as UserContextType | null;
  const hasSpotify = !!userContext?.userAccount?.hasSpotify;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <Card className="bg-muted shadow-lg border border-muted-foreground/10 relative overflow-hidden">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card/80 text-foreground px-4 py-2 rounded-full text-sm font-medium border border-muted-foreground/20 z-10">
          SyncTunez
        </div>
        <CardHeader className="text-center pb-6 pt-10">
          <div className="w-20 h-20 bg-gradient-to-r from-[#1DB954] to-[#1ed760] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <IconBrandSpotify className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Connect Your Spotify
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
            Link your Spotify account to access your playlists
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 px-8 pb-8">
          {!hasSpotify ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-[#1DB954] rounded-full"></div>
                  <span>Import your existing Spotify playlists</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-[#1DB954] rounded-full"></div>
                  <span>Find songs in common with your friends</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-[#1DB954] rounded-full"></div>
                  <span>Create new shared playlists directly in Spotify</span>
                </div>
              </div>
              
              <div className="bg-card/80 rounded-lg p-4 border border-muted-foreground/20">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-card rounded-full flex items-center justify-center mt-0.5 border border-muted-foreground/20">
                    <svg className="w-3 h-3 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Your data is secure</h4>
                    <p className="text-sm text-muted-foreground mt-1">We only access your playlist information and never modify your existing playlists without permission.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] hover:from-[#1ed760] hover:to-[#1DB954] text-white px-8 py-6 h-auto text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <a href={buildUrl("/spotify/connect")}>
                    <IconBrandSpotify className="w-5 h-5 mr-2" />
                    Connect Spotify
                  </a>
                </Button>
              </div>
            </>
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
              
              <div className="bg-card/80 rounded-lg p-4 border border-muted-foreground/20">
                <div className="flex items-center space-x-3">
                  <IconBrandSpotify className="w-5 h-5 text-[#1DB954]" />
                  <div>
                    <p className="font-medium text-foreground">Ready to import playlists</p>
                    <p className="text-sm text-muted-foreground mt-1">You can now access and import your Spotify playlists</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button
                  onClick={onNext}
                  size="lg"
                  className="bg-card/80 hover:bg-card text-foreground border border-muted-foreground/20 hover:border-muted-foreground/40 px-8 py-6 h-auto text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Continue to Import Playlist
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 