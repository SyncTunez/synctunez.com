"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { TrackTable, TrackTableSkeleton } from "@/components/ui/playlist/track-table";
import { useSearchParams } from "next/navigation";
import { buildUrl } from "@/lib/api/apiClient";
import { useServerEvents } from "@/lib/api/ServerEvents";
import { MusicPlaylistImportResult, MusicPlaylistImportResultSchema, MusicPlaylistMeta, MusicTrack, MusicTrackSchema } from "@/lib/api/schemas";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconBrandSpotify, IconBrandApple, IconBrandYoutube, IconBrandTidal } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function PlaylistPage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const createdParam = searchParams.get("created");
  const isNumericId = idParam != null && /^-?\d+$/.test(idParam);
  const playlistId = isNumericId ? Number(idParam) : undefined;

  const [tracks, setTracks] = useState<Array<MusicTrack>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMeta, setSelectedMeta] = useState<MusicPlaylistMeta | null>(null);
  const [loadingMeta, setLoadingMeta] = useState<boolean>(false);

  useEffect(() => {
    if (createdParam === 'true') {
      // Defer until after paint to ensure the Toaster is mounted
      setTimeout(() => {
        toast.success('Playlist created successfully!');
      }, 0);
    }
  }, [createdParam]);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    async function loadTracks() {
      // Reset
      setTracks([]);
      if (playlistId == null) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        eventSource = await useServerEvents<Array<MusicTrack>>(
          buildUrl(`music/playlists/tracks?id=${playlistId}`),
          "ImportedPlaylistTracks",
          MusicTrackSchema.array(),
          (data) => {
            setTracks((prev) => [...prev, ...data]);
            setIsLoading(false);
          }
        );
      } catch (err) {
        setIsLoading(false);
      }
    }

    loadTracks();
    return () => {
      eventSource?.close();
    };
  }, [playlistId]);

  // Load metadata for imported playlist ids by listening to imported playlists and selecting the matching id
  useEffect(() => {
    let eventSource: EventSource | null = null;
    async function loadMeta() {
      if (playlistId == null) {
        setSelectedMeta(null);
        setLoadingMeta(false);
        return;
      }
      setLoadingMeta(true);
      try {
        eventSource = await useServerEvents<Array<MusicPlaylistImportResult>>(
          buildUrl(`music/playlists?id=${playlistId}`),
          "ImportedPlaylists",
          MusicPlaylistImportResultSchema.array(),
          (data) => {
            console.log("Loaded meta for playlistId", playlistId, data);
            if(data.length > 0) {
              const found = data[0];
              setSelectedMeta(found.meta);
            } else {
              setSelectedMeta(null);
            }
            setLoadingMeta(false);
          }
        );
      } catch (_err) {
        setLoadingMeta(false);
      }
    }
    loadMeta();
    return () => {
      eventSource?.close();
    };
  }, [playlistId]);

  const invalidId = idParam != null && Number.isNaN(Number(idParam));

  const serviceBadges = useMemo(() => {
    const services: Array<{ id: string; label: string; icon: React.ReactNode }> = [
      { id: "spotify", label: "Spotify", icon: <IconBrandSpotify className="w-3.5 h-3.5" /> },
      { id: "apple", label: "Apple", icon: <IconBrandApple className="w-3.5 h-3.5" /> },
      { id: "youtube", label: "YouTube", icon: <IconBrandYoutube className="w-3.5 h-3.5" /> },
      { id: "tidal", label: "Tidal", icon: <IconBrandTidal className="w-3.5 h-3.5" /> },
    ];
    return services.map((svc) => {
      const isOrigin = selectedMeta?.from?.toLowerCase() === svc.id;
      // Render as non-interactive badges to avoid navigation/refresh
      return (
        <Badge
          key={svc.id}
          variant={isOrigin ? "default" : "outline"}
          className={isOrigin ? "cursor-default" : "opacity-60 cursor-not-allowed"}
        >
          {svc.icon}
          {svc.label}
        </Badge>
      );
    });
  }, [selectedMeta?.from]);

  return (
    <PageContainer constrained>
      <div className="flex flex-1 flex-col min-w-0 space-y-6 px-2 sm:px-4 py-6">

        {/* Metadata Card */}
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-start gap-6">
              <div>
                {selectedMeta?.image?.url ? (
                  <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-md overflow-hidden border">
                    <Image src={selectedMeta.image.url} alt={selectedMeta.title} fill sizes="176px" className="object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-md border bg-muted flex items-center justify-center text-muted-foreground text-xs">No Cover</div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-2xl sm:text-3xl font-bold">
                      {selectedMeta?.title || (loadingMeta ? <Skeleton className="h-7 w-48 inline-block align-middle" /> : "Playlist")}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground truncate">
                      {selectedMeta ? (
                        <>By {selectedMeta.owner}{selectedMeta.trackNumber != null ? ` • ${selectedMeta.trackNumber} tracks` : ''}</>
                      ) : invalidId ? (
                        "Invalid playlist id"
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">{serviceBadges}</div>
                </div>

                <div className="mt-3">
                  {loadingMeta ? (
                    <Skeleton className="h-4 w-64 sm:w-80" />
                  ) : (
                    <div className="text-base sm:text-lg text-muted-foreground">No description provided.</div>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Collaborators</div>
                  {loadingMeta ? (
                    <div className="flex items-center gap-2">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-6 w-16 rounded-full" />
                      ))}
                    </div>
                  ) : selectedMeta?.collaborators?.length ? (
                    <div className="flex items-center gap-3 flex-wrap">
                      {selectedMeta.collaborators.map((name) => (
                        <Link key={name} href={`/profile/${encodeURIComponent(name)}`} className="flex items-center gap-2 rounded-full px-2 py-1 border hover:bg-accent transition-colors">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="" alt={name} />
                            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{name}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No collaborators</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracks Card */}
        <Card>
          <CardContent className="p-0 pb-3">
            {isLoading ? (
              <TrackTableSkeleton />
            ) : (
              <TrackTable
                tracks={tracks}
                isSpotify={true}
                emptyLabel={
                  playlistId == null ? "No playlist selected." : "No tracks found."
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}


