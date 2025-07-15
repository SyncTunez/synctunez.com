'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlaylist, IconMusic, IconCheck, IconLoader } from "@tabler/icons-react";
import { buildUrl, authorized } from "@/lib/api/apiClient";
import { useContext, useState, useEffect } from "react";
import { UserContext, UserContextType } from "@/components/auth/UserContext";
import { useLiveResourceJson } from "@/hooks/useLiveResource";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { SpotifyPlaylist } from "@/lib/api/types";

interface Step3ChoosePlaylistProps {
  onNext: () => void;
}

export function Step3ChoosePlaylist({ onNext }: Step3ChoosePlaylistProps) {
  const userContext = useContext(UserContext) as UserContextType | null;
  const hasSpotify = !!userContext?.userAccount?.hasSpotify;
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [importing, setImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);

  // Fetch Spotify playlists
  const {
    data: rawPlaylists,
    error: playlistError
  } = useLiveResourceJson<SpotifyPlaylist>({
    fetchUrl: buildUrl('spotify/playlists'),
    eventName: 'SpotifyPlaylists',
    reconnectIntervalMs: 5000,
    shouldProcess: hasSpotify,
  });

  const playlists: SpotifyPlaylist[] = Array.isArray(rawPlaylists)
    ? rawPlaylists
    : rawPlaylists && typeof rawPlaylists === 'object' && 'id' in rawPlaylists
      ? [rawPlaylists as SpotifyPlaylist]
      : [];

  const handleImportPlaylist = async (playlist: SpotifyPlaylist) => {
    setImporting(true);
    try {
      const response = await authorized.post(`music/playlists/import`, {
        spotifyPlaylistId: playlist.id,
        name: playlist.name,
        description: playlist.description,
        imageUrl: playlist.images?.[0]?.url || null,
        totalTracks: playlist.tracks?.total || 0
      });
      
      if (response.status === 200) {
        setImportComplete(true);
        toast.success(`Successfully imported "${playlist.name}"`);
      }
    } catch (error) {
      console.error('Failed to import playlist:', error);
      toast.error('Failed to import playlist. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  if (!hasSpotify) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <Card className="bg-muted shadow-lg border border-muted-foreground/10 relative overflow-hidden">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card/80 text-foreground px-4 py-2 rounded-full text-sm font-medium border border-muted-foreground/20 z-10">
            SyncTunez
          </div>
          <CardContent className="text-center py-16">
            <p className="text-xl text-muted-foreground">Please connect your Spotify account first to choose a playlist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <Card className="bg-muted shadow-lg border border-muted-foreground/10 relative overflow-hidden">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card/80 text-foreground px-4 py-2 rounded-full text-sm font-medium border border-muted-foreground/20 z-10">
          SyncTunez
        </div>
        <CardHeader className="text-center pb-6 pt-10">
          <div className="w-20 h-20 bg-gradient-to-r from-[#0f766e] to-[#14b8a6] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <IconPlaylist className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Choose a Playlist
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
            Select a playlist from your Spotify to import and share with friends
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 px-8 pb-8">
          {importComplete ? (
            <>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-card/80 rounded-full flex items-center justify-center mx-auto border border-muted-foreground/20">
                  <IconCheck className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Playlist Imported!</h3>
                  <p className="text-muted-foreground mt-1">"{selectedPlaylist?.name}" is now ready to sync with friends</p>
                </div>
              </div>
              
              <div className="bg-card/80 rounded-lg p-4 border border-muted-foreground/20">
                <div className="flex items-center space-x-3">
                  <IconMusic className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Ready to sync</p>
                    <p className="text-sm text-muted-foreground mt-1">Your playlist is now available for syncing with friends</p>
                  </div>
                </div>
              </div>
              
              <div className="relative -mx-8 -mb-8 mt-8 bg-black/5 px-8 py-6 border-t border-muted-foreground/10">
                <div className="flex justify-center">
                  <Button
                    onClick={onNext}
                    size="lg"
                    className="bg-card/80 hover:bg-card text-foreground border border-muted-foreground/20 hover:border-muted-foreground/40 px-8 py-6 h-auto text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Continue to Invite Friends
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
                             <div className="space-y-6">
                 <p className="text-base text-muted-foreground max-w-3xl mx-auto text-center">
                   Choose one of your Spotify playlists to import. This will be your first playlist available for syncing with friends.
                 </p>
                 
                 <div className="max-h-80 overflow-y-auto space-y-3 px-4">
                  {playlists.length === 0 ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-16 w-full bg-card/80" />
                      ))}
                    </div>
                  ) : (
                    playlists.map((playlist) => (
                      <div
                        key={playlist.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedPlaylist?.id === playlist.id
                            ? 'border-muted-foreground/40 bg-card'
                            : 'border-muted-foreground/20 hover:border-muted-foreground/30 hover:bg-card/80'
                        }`}
                        onClick={() => setSelectedPlaylist(playlist)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-card/80 rounded-md flex items-center justify-center overflow-hidden border border-muted-foreground/20">
                            {playlist.images?.[0]?.url ? (
                              <img
                                src={playlist.images[0].url}
                                alt={playlist.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <IconMusic className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{playlist.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {playlist.tracks?.total || 0} tracks
                            </p>
                          </div>
                          {selectedPlaylist?.id === playlist.id && (
                            <IconCheck className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {selectedPlaylist && (
                <div className="relative -mx-8 -mb-8 mt-8 bg-black/5 px-8 py-6 border-t border-muted-foreground/10">
                  <div className="flex justify-center">
                    <Button
                      onClick={() => handleImportPlaylist(selectedPlaylist)}
                      disabled={importing}
                      size="lg"
                      className="bg-card/80 hover:bg-card text-foreground border border-muted-foreground/20 hover:border-muted-foreground/40 px-8 py-6 h-auto text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                      {importing ? (
                        <>
                          <IconLoader className="w-5 h-5 mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          Import "{selectedPlaylist.name}"
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 