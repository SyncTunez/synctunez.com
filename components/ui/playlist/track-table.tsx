import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
import { Skeleton } from "@/components/ui/skeleton";
import type { MusicTrack } from '@/lib/api/schemas';
import { tr } from 'zod/v4/locales';
import { Button } from "@/components/ui/button";
import { IconTrash, IconBan } from "@tabler/icons-react";

// Helper to format ms → mm:ss
function formatDuration(ms: number): string {
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export interface TrackTableProps {
    tracks: MusicTrack[];
    isSpotify: boolean;
    className?: string;
    emptyLabel?: React.ReactNode;
    showTrackCount?: boolean;
    totalTracks?: number;
    onRemoveTrack?: (track: MusicTrack, key: string) => void;
    scrollClassName?: string; // controls the scroll container height/behavior
    onBlockArtist?: (artistName: string) => void;
}

export const TrackTable: React.FC<TrackTableProps> = ({
                                                          tracks,
                                                          isSpotify,
                                                          className,
                                                          emptyLabel = (
                                                            <div className="text-center">
                                                              <p className="text-muted-foreground mb-2">No tracks found.</p>
                                                              <p className="text-sm text-muted-foreground">Select a playlist for you and your friend and any songs in common will appear here.</p>
                                                            </div>
                                                          ),
                                                          showTrackCount = false,
                                                          totalTracks,
                                                          onRemoveTrack,
                                                          scrollClassName,
                                                           onBlockArtist,
                                                      }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const updateWidth = () => setContainerWidth(containerRef.current?.offsetWidth || 0);
        updateWidth();

        window.addEventListener('resize', updateWidth);
        const resizeObserver = new ResizeObserver(() => updateWidth());
        resizeObserver.observe(containerRef.current);

        return () => {
            window.removeEventListener('resize', updateWidth);
            resizeObserver.disconnect();
        };
    }, []);

    if (!Array.isArray(tracks) || tracks.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-muted-foreground w-full">
                {emptyLabel}
            </div>
        );
    }

    function truncateWords(text: string | undefined | null, count: number) {
        if (!text) return '';
        const words = text.split(" ");
        return words.length > count ? words.slice(0, count).join(" ") + "..." : text;
    }

    // Responsive visibility breakpoints
    const showAlbum = true;
    const showDuration = false;
    const showArtist = true;  // Hide artist column below 450px
    const showCover = true; // Cover always shown

    // Table layout fixed for consistent column widths
    const tableStyle: React.CSSProperties = {
        width: '100%',
        tableLayout: 'fixed'
    };

    // Define column widths depending on visible columns, must total <= 100%
    const colGroup = (
        <colgroup>
            <col style={{ width: '32px' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '30%' }} />
            {showDuration && <col style={{ width: '50px' }} />}
        </colgroup>
    );

    const buildTrackKey = (track: MusicTrack): string => {
        const idPart = `${track.spotifyId || 'no-spotify'}|${track.youtubeId || 'no-youtube'}`;
        const metaPart = `${track.title}|${(track.artists || []).join(',')}`;
        return `${idPart}|${metaPart}`;
    };

    return (
        <div ref={containerRef} className={className}>
            <div className={scrollClassName || "h-[450px] overflow-y-auto overflow-x-hidden pr-2"}> {/* Reduced from pr-4 to pr-2 */}
                <Table style={tableStyle}>
                    {colGroup}
                    <TableHeader className="sticky top-0 z-20">
                        <TableRow>
                            {showCover && <TableHead className="p-2 text-center">Cover</TableHead>}
                            <TableHead className="p-2">Title</TableHead>
                            {showArtist && <TableHead className="p-2">Artist</TableHead>}
                            {showAlbum && <TableHead className="p-2">Album</TableHead>}
                            {showDuration && <TableHead className="p-2 text-center">Duration</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tracks.map((track: any) => {
                            const uniqueKey = buildTrackKey(track);
                            
                            return (
                                <TableRow key={uniqueKey} className="group">
                                    {showCover && (
                                        <TableCell className="p-2">
                                            <div className="relative w-12 h-12 group-hover:scale-105 transition-transform mx-auto">
                                                <Image
                                                    src={track.images?.[0]?.url || ''}
                                                    alt={track.title || 'Album cover'}
                                                    fill
                                                    sizes="48px"
                                                    className="rounded-md object-cover shadow-sm"
                                                />
                                            </div>
                                        </TableCell>
                                    )}
                                    <TableCell className="p-2 truncate">
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium truncate flex-1 min-w-0">{truncateWords(track.title, 6)}</div>
                                            {onRemoveTrack && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-accent hover:[&>svg]:text-white flex-shrink-0"
                                                            aria-label={`Remove ${track.title} from list`}
                                                            onClick={() => onRemoveTrack(track, uniqueKey)}
                                                        >
                                                            <IconTrash className="w-4 h-4 text-muted-foreground" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="left" align="center">Remove Track</TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </TableCell>
                                    {showArtist && (
                                        <TableCell className="p-2 text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="truncate flex-1 min-w-0">
                                                    {track.artists.slice(0, 2).join(', ')}
                                                    {track.artists.length > 2 && ` +${track.artists.length - 2} more`}
                                                </div>
                                                {onBlockArtist && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="hover:bg-accent hover:[&>svg]:text-white flex-shrink-0"
                                                                aria-label={`Block ${track.artists?.[0] ?? 'artist'}`}
                                                                onClick={() => {
                                                                    const primary = (track.artists && track.artists.length > 0) ? track.artists[0] : undefined;
                                                                    if (primary) onBlockArtist(primary);
                                                                }}
                                                            >
                                                                <IconBan className="w-4 h-4 text-muted-foreground" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="left" align="center">Remove Artist</TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </TableCell>
                                    )}
                                    {showAlbum && (
                                        <TableCell className="p-2 text-muted-foreground truncate max-w-xs">
                                            {truncateWords(track.album, 4)}
                                        </TableCell>
                                    )}
                                    {showDuration && (
                                        <TableCell className="p-2 text-muted-foreground text-center whitespace-nowrap">
                                            {formatDuration(track.duration)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {showTrackCount && totalTracks && totalTracks > tracks.length && (
                    <div className="px-4 py-3 border-t bg-muted/30 mt-2">
                        <p className="text-xs text-muted-foreground text-center">
                            Showing {tracks.length} of {totalTracks} tracks
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// TrackTableSkeleton component that matches the actual track table structure
export const TrackTableSkeleton: React.FC<{ className?: string }> = ({ className }) => {
    // Responsive visibility breakpoints (same as actual component)
    const showAlbum = true;
    const showDuration = false;
    const showArtist = true;
    const showCover = true;

    // Table layout fixed for consistent column widths (same as actual component)
    const tableStyle: React.CSSProperties = {
        width: '100%',
        tableLayout: 'fixed'
    };

    // Define column widths depending on visible columns (same as actual component)
    const colGroup = (
        <colgroup>
            <col style={{ width: '32px' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '30%' }} />
            {showDuration && <col style={{ width: '50px' }} />}
        </colgroup>
    );

    return (
        <div className={className}>
            <div className="h-[450px] overflow-y-auto overflow-x-hidden pr-2">
                <Table style={tableStyle}>
                    {colGroup}
                    <TableHeader className="sticky top-0 z-20">
                        <TableRow>
                            {showCover && <TableHead className="p-2 text-center">Cover</TableHead>}
                            <TableHead className="p-2">Title</TableHead>
                            {showArtist && <TableHead className="p-2">Artist</TableHead>}
                            {showAlbum && <TableHead className="p-2">Album</TableHead>}
                            {showDuration && <TableHead className="p-2 text-center">Duration</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 10 }).map((_, idx) => (
                            <TableRow key={idx} className="group">
                                {showCover && (
                                    <TableCell className="p-2">
                                        <div className="relative w-12 h-12 mx-auto">
                                            <Skeleton className="w-12 h-12 rounded-md" />
                                        </div>
                                    </TableCell>
                                )}
                                <TableCell className="p-2">
                                    <div className="font-medium">
                                        <Skeleton className="h-4 w-3/4 mb-1" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </TableCell>
                                {showArtist && (
                                    <TableCell className="p-2 text-muted-foreground">
                                        <Skeleton className="h-4 w-2/3" />
                                    </TableCell>
                                )}
                                {showAlbum && (
                                    <TableCell className="p-2 text-muted-foreground">
                                        <Skeleton className="h-4 w-4/5" />
                                    </TableCell>
                                )}
                                {showDuration && (
                                    <TableCell className="p-2 text-muted-foreground text-center">
                                        <Skeleton className="h-4 w-12 mx-auto" />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};