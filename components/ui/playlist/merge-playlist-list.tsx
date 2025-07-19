import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlaylistRow } from "@/components/ui/playlist/playlist-row";
import { IconMusic, IconBrandSpotify, IconBrandApple, IconBrandYoutube, IconBrandTidal } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { MusicPlaylistMeta } from '@/lib/api/types';

export interface MergePlaylistListProps {
  playlists: MusicPlaylistMeta[];
  selectedPlaylistId?: number;
  onPlaylistSelect: (playlistId: number) => void;
  title?: string;
  emptyMessage?: string;
  className?: string;
  loading?: boolean;
}

/**
 * Simple playlist list component for the merge page
 */
export const MergePlaylistList: React.FC<MergePlaylistListProps> = ({
  playlists,
  selectedPlaylistId,
  onPlaylistSelect,
  title = "Playlists",
  emptyMessage = "No playlists found",
  className,
  loading = false,
}) => {
  // Get service icon based on the 'from' field
  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'spotify':
        return <IconBrandSpotify className="w-5 h-5 text-green-500" />;
      case 'apple':
        return <IconBrandApple className="w-5 h-5 text-gray-500" />;
      case 'youtube':
        return <IconBrandYoutube className="w-5 h-5 text-red-500" />;
      case 'tidal':
        return <IconBrandTidal className="w-5 h-5 text-blue-500" />;
      default:
        return <IconMusic className="w-5 h-5 text-muted-foreground" />;
    }
  };

  // Format track count
  const formatTrackCount = (count: number) => {
    return `${count} track${count !== 1 ? 's' : ''}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          {selectedPlaylistId && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              Selected
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="max-h-[500px] overflow-y-auto">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 border-b border-border last:border-b-0">
                <Skeleton className="w-10 h-10 rounded-sm flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[140px]" />
                </div>
                <Skeleton className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground px-4">
            {emptyMessage}
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto">
            {playlists.map((playlist) => (
              <PlaylistRow
                key={playlist.id}
                imageUrl={playlist.image?.url}
                defaultIcon={getServiceIcon(playlist.from)}
                title={playlist.title}
                subtitle={`${formatTrackCount(playlist.trackNumber)} • ${playlist.owner}`}
                selected={selectedPlaylistId === playlist.id}
                onClick={() => onPlaylistSelect(playlist.id)}
                showRadioButton={true}
                className="border-b border-border last:border-b-0"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 