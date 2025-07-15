'use client';

import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { UserContext, UserContextType } from "@/components/auth/UserContext";
import { OnboardingLayout } from "./onboarding-layout";
import { OnboardingCard } from "./onboarding-card";
import { IconMusic, IconBrandSpotify } from "@tabler/icons-react";
import { PlaylistRow } from "@/components/ui/playlist/playlist-row";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLiveResourceJson } from "@/hooks/useLiveResource";
import type { SpotifyPlaylist } from "@/lib/api/types";
import { buildUrl } from "@/lib/api/apiClient";

interface Step3ChoosePlaylistProps {
  onNext: () => void;
}

export function Step3ChoosePlaylist({ onNext }: Step3ChoosePlaylistProps) {
  const userContext = useContext(UserContext) as UserContextType | null;
  const hasSpotify = !!userContext?.userAccount?.hasSpotify;
  const [selectedPlaylists, setSelectedPlaylists] = useState<Set<string>>(new Set());

  const {
    data: rawSpotifyPlaylists,
    error: spotifyPlaylistsError
  } = useLiveResourceJson<SpotifyPlaylist>({
    fetchUrl: buildUrl('spotify/playlists'),
    eventName: 'SpotifyPlaylist',
    reconnectIntervalMs: 5000,
    shouldProcess: hasSpotify,
  });

  const playlistsLoading = rawSpotifyPlaylists === undefined;

  const playlists: SpotifyPlaylist[] = Array.isArray(rawSpotifyPlaylists)
    ? rawSpotifyPlaylists
    : rawSpotifyPlaylists && typeof rawSpotifyPlaylists === 'object' && 'id' in rawSpotifyPlaylists
      ? [rawSpotifyPlaylists as SpotifyPlaylist]
      : [];

  const SpotifyIcon = () => (
    <IconBrandSpotify className="w-10 h-10 text-[#1DB954]" />
  );

  const togglePlaylist = (id: string) => {
    setSelectedPlaylists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <OnboardingLayout>
      <OnboardingCard
        icon={<SpotifyIcon />}
        title="Choose Your Playlists"
        description="Select the playlists you want to import into SyncTunez"
      >
        <div className="space-y-4">
          {/* Playlist Selection Area */}
          <div className="bg-card/80 rounded-lg border border-muted-foreground/20 w-full max-w-[560px] mx-auto">
            <ScrollArea className="h-[320px] w-full rounded-md">
              {playlistsLoading ? (
                // Loading state
                <div className="p-2 space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-[64px] bg-muted animate-pulse rounded-md" />
                  ))}
                </div>
              ) : playlists.length > 0 ? (
                // Playlist list
                <div className="py-2">
                  {playlists.map((playlist: SpotifyPlaylist) => (
                    <PlaylistRow
                      key={playlist.id}
                      imageUrl={playlist.images?.[0]?.url}
                      defaultIcon={<IconMusic className="w-6 h-6" />}
                      title={playlist.name ?? 'Untitled Playlist'}
                      subtitle={playlist.tracks ? `${playlist.tracks.total} tracks` : undefined}
                      selected={selectedPlaylists.has(playlist.id)}
                      onClick={() => togglePlaylist(playlist.id)}
                      className="text-left hover:bg-muted/30 py-2"
                      imageClassName="w-12 h-12 sm:w-14 sm:h-14"
                      titleClassName="text-base sm:text-lg font-medium"
                      subtitleClassName="text-sm text-muted-foreground/80"
                      rightElement={
                        selectedPlaylists.has(playlist.id) ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-muted-foreground/30" />
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                // Empty state
                <div className="p-8 text-center text-muted-foreground">
                  <IconMusic className="w-8 h-8 mx-auto mb-2" />
                  <p>No playlists found</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={onNext}
              size="lg"
              disabled={selectedPlaylists.size === 0}
              className="bg-card/80 hover:bg-card text-foreground border border-muted-foreground/20 hover:border-muted-foreground/40 px-6 sm:px-8 py-6 h-auto text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Import {selectedPlaylists.size} {selectedPlaylists.size === 1 ? 'Playlist' : 'Playlists'}
            </Button>
          </div>

          {/* Helper Text */}
          <p className="text-sm text-muted-foreground text-center">
            You can always import more playlists later from your account settings
          </p>
        </div>
      </OnboardingCard>
    </OnboardingLayout>
  );
} 