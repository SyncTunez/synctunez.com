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
import type { MusicTrack } from '@/lib/api/types';
import { tr } from 'zod/v4/locales';

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
    emptyLabel?: string;
}

export const TrackTable: React.FC<TrackTableProps> = ({
                                                          tracks,
                                                          isSpotify,
                                                          className,
                                                          emptyLabel = 'No tracks found',
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

    return (
        <div ref={containerRef} className={className}>
            <div className="h-[450px] overflow-y-auto overflow-x-hidden pr-2"> {/* Reduced from pr-4 to pr-2 */}
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
                        {tracks.map((track: any, idx: number) => {
                        
                            return (
                                <TableRow key={track.hash || idx} className="group">
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
                                        <div className="font-medium truncate">{truncateWords(track.title, 6)}</div>
                                    </TableCell>
                                    {showArtist && (
                                        <TableCell className="p-2 text-muted-foreground">
                                            <div className="truncate">
                                                {track.artists.slice(0, 2).join(', ')}
                                                {track.artists.length > 2 && ` +${track.artists.length - 2} more`}
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
                                            {formatDuration(track.durationMs)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};