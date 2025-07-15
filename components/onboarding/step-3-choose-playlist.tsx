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
import { buildUrl, authorized } from "@/lib/api/apiClient";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Step3ChoosePlaylistProps {
  onNext: () => void;
}

export function Step3ChoosePlaylist({ onNext }: Step3ChoosePlaylistProps) {
  const userContext = useContext(UserContext) as UserContextType | null;
  const hasSpotify = !!userContext?.userAccount?.hasSpotify;
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const {
    data: rawSpotifyPlaylists,
    error: spotifyPlaylistsError
  } = useLiveResourceJson<SpotifyPlaylist>({
    fetchUrl: buildUrl('spotify/playlists'),
    eventName: 'SpotifyPlaylist',
    reconnectIntervalMs: 5000,
    shouldProcess: hasSpotify,
  });

  // Listen for import completion events
  const {
    data: importedPlaylist
  } = useLiveResourceJson<SpotifyPlaylist>({
    fetchUrl: '',  // No initial fetch needed
    eventName: 'ImportedPlaylist',
    reconnectIntervalMs: 5000,
    shouldProcess: isImporting,
    onMessage: (data) => {
      if (data?.id === selectedPlaylist) {
        toast.success('Playlist imported successfully!');
        setIsImporting(false);
        onNext();
      }
    }
  });

  const playlists: SpotifyPlaylist[] = Array.isArray(rawSpotifyPlaylists)
    ? rawSpotifyPlaylists
    : rawSpotifyPlaylists && typeof rawSpotifyPlaylists === 'object' && 'id' in rawSpotifyPlaylists
      ? [rawSpotifyPlaylists as SpotifyPlaylist]
      : [];

  const SpotifyIcon = () => (
    <IconBrandSpotify className="w-10 h-10 text-[#1DB954]" />
  );

  const selectPlaylist = (id: string) => {
    setSelectedPlaylist(id);
  };

  const handleImport = async () => {
    if (!selectedPlaylist) return;
    
    setIsImporting(true);
    try {
      await authorized.post(buildUrl('music/playlists/import'), {
        playlistId: selectedPlaylist,
        service: 'spotify'
      });
      // Don't navigate yet - wait for the SSE event
    } catch (error) {
      toast.error('Failed to import playlist. Please try again.');
      setIsImporting(false);
    }
  };

  const renderContent = () => {
    // Show skeletons while loading or if no data yet
    if (!rawSpotifyPlaylists) {
      return (
        <div className="py-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 py-2 px-4 sm:px-6 grid grid-cols-[auto_1fr_auto]">
              <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-sm" />
              <div className="space-y-2 pl-2">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-[140px]" />
              </div>
              <Skeleton className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0 mr-2" />
            </div>
          ))}
        </div>
      );
    }

    // Show empty state if we have data but no playlists
    if (playlists.length === 0) {
      return (
        <div className="p-8 text-center text-muted-foreground">
          <IconMusic className="w-8 h-8 mx-auto mb-2" />
          <p>No playlists found</p>
        </div>
      );
    }

    // Show playlists if we have them
    return (
      <div className="py-2">
        {playlists.map((playlist: SpotifyPlaylist) => (
          <PlaylistRow
            key={playlist.id}
            imageUrl={playlist.images?.[0]?.url}
            defaultIcon={<IconMusic className="w-6 h-6" />}
            title={playlist.name ?? 'Untitled Playlist'}
            subtitle={playlist.tracks ? `${playlist.tracks.total} tracks` : undefined}
            selected={selectedPlaylist === playlist.id}
            onClick={() => selectPlaylist(playlist.id)}
            className="text-left hover:bg-muted/30 py-2 px-4 sm:px-6 grid grid-cols-[auto_1fr_auto] items-center gap-2"
            imageClassName="w-12 h-12 sm:w-14 sm:h-14"
            titleClassName="text-base sm:text-lg font-medium pl-2 truncate max-w-[calc(100%-40px)]"
            subtitleClassName="text-sm text-muted-foreground/80 pl-2 truncate max-w-[calc(100%-40px)]"
            rightElement={
              selectedPlaylist === playlist.id ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-muted-foreground/30 mr-2 flex-shrink-0" />
              )
            }
          />
        ))}
      </div>
    );
  };

  return (
    <OnboardingLayout>
      <OnboardingCard
        icon={<SpotifyIcon />}
        title="Choose Your Playlist"
        description="Select the playlist you want to import into SyncTunez"
      >
        <div className="space-y-4">
          {/* Playlist Selection Area */}
          <div className="bg-card/80 rounded-lg border border-muted-foreground/20 w-full max-w-[560px] mx-auto">
            <ScrollArea className="h-[320px] w-full rounded-md">
              {renderContent()}
            </ScrollArea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleImport}
              size="lg"
              disabled={!selectedPlaylist || isImporting}
              className="bg-card/80 hover:bg-card text-foreground border border-muted-foreground/20 hover:border-muted-foreground/40 px-6 sm:px-8 py-6 h-auto text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isImporting ? 'Importing...' : 'Import Playlist'}
            </Button>
          </div>

          {/* Helper Text */}
          <p className="text-sm text-muted-foreground text-center">
            You can import all your playlists with TunezSync premium.
          </p>
        </div>
      </OnboardingCard>
    </OnboardingLayout>
  );
} 