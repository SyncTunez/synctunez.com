import React, { useState, useEffect, useRef } from 'react';
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

// Helper to format ms → mm:ss
function formatDuration(ms: number): string {
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export interface TrackTableProps {
    tracks: any[];
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

    function truncateWords(text: string, count: number) {
        const words = text.split(" ");
        return words.length > count ? words.slice(0, count).join(" ") + "..." : text;
    }

    // Responsive visibility breakpoints
    const showAlbum = containerWidth > 600;
    const showDuration = containerWidth > 500;
    const showArtist = containerWidth > 450;  // Hide artist column below 450px
    const showCover = true; // Cover always shown

    // Table layout fixed for consistent column widths
    const tableStyle: React.CSSProperties = {
        width: '100%',
        tableLayout: 'fixed'
    };

    // Define column widths depending on visible columns, must total <= 100%
    const colGroup = (
        <colgroup>
            {showCover && <col style={{ width: '60px' }} />}  {/* Increased from 40px to 60px for more space */}
            <col style={{ width: showAlbum ? '30%' : '40%' }} />
            {showArtist && <col style={{ width: '20%' }} />}
            {showAlbum && <col style={{ width: '30%' }} />}
            {showDuration && <col style={{ width: '60px' }} />}  {/* Increased from 40px to 60px for more space */}
        </colgroup>
    );

    return (
        <div ref={containerRef} className={className}>
            <div className="h-[450px] overflow-y-auto pr-4"> {/* Increased from pr-2 to pr-4 */}
                <Table style={tableStyle}>
                    {colGroup}
                    <TableHeader className="sticky top-0 z-20">
                        <TableRow>
                            {showCover && <TableHead className="p-4 text-center">Cover</TableHead>}
                            <TableHead className="p-4">Title</TableHead>
                            {showArtist && <TableHead className="p-4">Artist</TableHead>}
                            {showAlbum && <TableHead className="p-4">Album</TableHead>}
                            {showDuration && <TableHead className="p-4 text-center">Duration</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tracks.map((track: any, idx: number) => {
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
                                <TableRow key={track.hash} className="group">
                                    {showCover && (
                                        <TableCell className="p-4">
                                            {coverUrl ? (
                                                <div className="relative w-12 h-12 group-hover:scale-105 transition-transform mx-auto">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={coverUrl}
                                                        alt={title}
                                                        loading="lazy"
                                                        className="w-full h-full rounded-md object-cover shadow-sm"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                                                    <IconBrandSpotify className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                        </TableCell>
                                    )}
                                    <TableCell className="p-4 truncate">
                                        <div className="font-medium truncate">{truncateWords(title, 6)}</div>
                                    </TableCell>
                                    {showArtist && (
                                        <TableCell className="p-4 text-muted-foreground">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex -space-x-2 cursor-pointer">
                                                        {artistsArr.slice(0, 2).map((artist: string, aidx: number) => (
                                                            <Avatar key={artist + aidx}>
                                                                <AvatarFallback>
                                                                    {artist
                                                                        .split(' ')
                                                                        .map((word) => word[0])
                                                                        .join('')
                                                                        .slice(0, 2)
                                                                        .toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ))}
                                                        {artistsArr.length > 2 && (
                                                            <Avatar>
                                                                <AvatarFallback>+{artistsArr.length - 2}</AvatarFallback>
                                                            </Avatar>
                                                        )}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {artistsArr.map((artist: string, i: number) => (
                                                        <div key={i}>{artist}</div>
                                                    ))}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                    )}
                                    {showAlbum && (
                                        <TableCell className="p-4 text-muted-foreground truncate max-w-xs">
                                            {truncateWords(albumName, 4)}
                                        </TableCell>
                                    )}
                                    {showDuration && (
                                        <TableCell className="p-4 text-muted-foreground text-center whitespace-nowrap">
                                            {formatDuration(durationMs)}
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