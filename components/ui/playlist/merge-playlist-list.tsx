import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlaylistRow } from "@/components/ui/playlist/playlist-row";
import { IconMusic, IconBrandSpotify, IconBrandApple, IconBrandYoutube, IconBrandTidal } from "@tabler/icons-react";
import type { MusicPlaylistMeta } from '@/lib/api/types';

export interface MergePlaylistListProps {
  playlists: MusicPlaylistMeta[];
  selectedPlaylistId?: number;
  onPlaylistSelect: (playlistId: number) => void;
  title?: string;
  emptyMessage?: string;
  className?: string;
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
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {playlists.length === 0 ? (
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
                className="border-b border-border last:border-b-0"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 