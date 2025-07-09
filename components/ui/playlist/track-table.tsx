import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconBrandSpotify } from "@tabler/icons-react";

// Shared helper to format the duration in mm:ss
function formatDuration(ms: number): string {
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export interface TrackTableProps {
    /**
     * Array of track objects coming from either the "main" playlist endpoint or the Spotify API.
     */
    tracks: any[];
    /**
     * Pass true when the track objects are in Spotify format (SpotifyTrack).
     * When false, the objects are assumed to be main playlist tracks (custom format)
     */
    isSpotify: boolean;
    /** Optional additional className for the wrapping Table */
    className?: string;
    /** Message to display when no tracks are provided */
    emptyLabel?: string;
}

/**
 * Reusable table for displaying tracks. Accepts mixed formats via the `isSpotify` prop.
 */
export const TrackTable: React.FC<TrackTableProps> = ({ tracks, isSpotify, className, emptyLabel = 'No tracks found' }) => {
    if (!Array.isArray(tracks) || tracks.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-muted-foreground w-full">
                {emptyLabel}
            </div>
        );
    }

    return (
        <Table className={className}>
            <TableHeader className="sticky top-0">
                <TableRow>
                    <TableHead className="w-[100px]">Cover</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead className="w-[100px]">Duration</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tracks.map((track: any, idx: number) => {
                    // Normalise the track properties depending on the source format
                    const coverUrl = isSpotify
                        ? track.album?.images?.[0]?.url
                        : track.images?.[0]?.url;
                    const title = isSpotify ? track.name : track.title;
                    const albumName = isSpotify ? track.album?.name : track.album;
                    const artistsArr = isSpotify
                        ? (track.artists || []).map((a: any) => a.name)
                        : track.artists || [];
                    const durationMs = isSpotify ? track.durationMs : track.duration;

                    return (
                        <TableRow key={track.id || track.hash || idx} className="group">
                            <TableCell>
                                {coverUrl ? (
                                    <div className="relative w-12 h-12 group-hover:scale-105 transition-transform">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={coverUrl}
                                            alt={title}
                                            className="w-full h-full rounded-md object-cover shadow-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                                        <IconBrandSpotify className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{title}</div>
                                {albumName && (
                                    <div className="text-xs text-muted-foreground mt-0.5">{albumName}</div>
                                )}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                                    {artistsArr.map((artist: string, aidx: number) => (
                                        <Tooltip key={artist + aidx}>
                                            <TooltipTrigger asChild>
                                                <span className="focus:outline-none">
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            {artist
                                                                .split(' ')
                                                                .map((word: string) => word[0])
                                                                .join('')
                                                                .slice(0, 2)
                                                                .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>{artist}</TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {formatDuration(durationMs)}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}; 