import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
    IconBrandSpotify, 
    IconBrandApple,
    IconBrandYoutube,
    IconBrandTidal,
    IconPlus, 
    IconSwitch2, 
    IconChevronDown 
} from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import type { SpotifyTrack, SpotifyPlaylist } from '@/lib/api/types';

interface SpotifyPlaylistSectionProps {
    playlists: SpotifyPlaylist[];
    tracks: SpotifyTrack[];
    selectedPlaylistId: string | undefined;
    onPlaylistSelect: (id: string) => void;
}

type Mode = 'playlist' | 'import';
type Service = 'spotify' | 'apple' | 'youtube' | 'tidal';

function formatDuration(ms: number): string {
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const services: { id: Service; key: string; label: string; icon: React.ReactNode }[] = [
    { id: 'spotify', key: 'hasSpotify', label: 'Spotify', icon: <IconBrandSpotify className="w-4 h-4 text-green-500" /> },
    { id: 'apple', key: 'hasApple', label: 'Apple Music', icon: <IconBrandApple className="w-4 h-4 text-gray-500" /> },
    { id: 'youtube', key: 'hasYoutube', label: 'YouTube', icon: <IconBrandYoutube className="w-4 h-4 text-red-500" /> },
    { id: 'tidal', key: 'hasTidal', label: 'Tidal', icon: <IconBrandTidal className="w-4 h-4 text-blue-500" /> },
];

export function SpotifyPlaylistSection({ 
    playlists, 
    tracks, 
    selectedPlaylistId, 
    onPlaylistSelect 
}: SpotifyPlaylistSectionProps) {
    const [mode, setMode] = useState<Mode>('playlist');
    const [selectedService, setSelectedService] = useState<Service>('spotify');

    const selectedServiceData = services.find(s => s.id === selectedService);

    return (
        <Card className="">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Playlists</CardTitle>
                    <CardDescription>
                        {mode === 'playlist' ? 'Your playlists' : 'Import from other services'}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {mode === 'import' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <span className="flex items-center gap-1">
                                        {selectedServiceData?.icon}
                                        {selectedServiceData?.label}
                                    </span>
                                    <IconChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {services.map((service) => (
                                    <DropdownMenuItem
                                        key={service.id}
                                        onClick={() => setSelectedService(service.id)}
                                        className="flex items-center gap-2"
                                    >
                                        {service.icon}
                                        {service.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMode(mode === 'playlist' ? 'import' : 'playlist')}
                            >
                                <IconSwitch2 className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Switch to {mode === 'playlist' ? 'Import' : 'Playlist'} Mode
                        </TooltipContent>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4">
                    {/* Playlist List */}
                    <div className="w-56 min-w-[180px] h-[50vh] overflow-y-auto border-r pr-2">
                        <div className="flex flex-col gap-2">
                            {playlists.map(playlist => (
                                <div
                                    key={playlist.id}
                                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${selectedPlaylistId === playlist.id ? 'bg-accent' : 'hover:bg-muted'}`}
                                    onClick={() => onPlaylistSelect(playlist.id)}
                                >
                                    {playlist.images?.[0]?.url ? (
                                        <img
                                            src={playlist.images[0].url}
                                            alt={playlist.name}
                                            className="w-10 h-10 rounded object-cover border"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center">
                                            <IconBrandSpotify className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="font-medium text-sm truncate">{playlist.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {playlist.description || 'No description'}
                                        </div>
                                    </div>
                                    {mode === 'import' && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="hover:bg-accent" 
                                                    tabIndex={-1} 
                                                    type="button" 
                                                    onClick={e => { e.stopPropagation(); /* handle import here if needed */ }}
                                                >
                                                    <IconPlus className="w-5 h-5 text-muted-foreground" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="left" align="center">
                                                Import
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Songs Table */}
                    <div className="flex-1 pl-4">
                        <div className="h-[50vh] overflow-y-auto">
                            {selectedPlaylistId ? (
                                <Table>
                                    <TableHeader className="sticky top-0">
                                        <TableRow>
                                            <TableHead className="w-[100px]">Cover</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Artist</TableHead>
                                            <TableHead className="w-[100px]">Duration</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tracks.length === 0 ? (
                                            Array.from({ length: 2 }).map((_, index) => (
                                                <TableRow key={`skeleton-${index}`}>
                                                    <TableCell>
                                                        <Skeleton className="w-12 h-12 rounded-md" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-2">
                                                            <Skeleton className="h-4 w-[200px]" />
                                                            <Skeleton className="h-3 w-[160px]" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex -space-x-2">
                                                            <Skeleton className="w-8 h-8 rounded-full" />
                                                            <Skeleton className="w-8 h-8 rounded-full" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Skeleton className="h-4 w-[60px]" />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            tracks.map((track) => (
                                                <TableRow key={track.id} className="group">
                                                    <TableCell>
                                                        {track.album.images?.[0]?.url ? (
                                                            <div className="relative w-12 h-12 group-hover:scale-105 transition-transform">
                                                                <img
                                                                    src={track.album.images[0].url}
                                                                    alt={track.name}
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
                                                        <div className="font-medium">{track.name}</div>
                                                        <div className="text-xs text-muted-foreground mt-0.5">{track.album.name}</div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                                                            {track.artists.map((artist) => (
                                                                <Tooltip key={artist.id}>
                                                                    <TooltipTrigger asChild>
                                                                        <Link
                                                                            href={`https://open.spotify.com/artist/${artist.id}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="focus:outline-none"
                                                                        >
                                                                            <Avatar>
                                                                                <AvatarFallback>{artist.name.slice(0, 2)}</AvatarFallback>
                                                                            </Avatar>
                                                                        </Link>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        {artist.name}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {formatDuration(track.durationMs)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex items-center justify-center h-32 text-muted-foreground">
                                    Select a playlist to view tracks
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 