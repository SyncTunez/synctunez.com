import React, { useState, useEffect } from 'react';
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
    Tabs,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import Link from "next/link";
import type { SpotifyTrack, SpotifyPlaylist } from '@/lib/api/types';
import { authorized, buildUrl } from '@/lib/api/apiClient';
import { toast } from 'sonner';
import { useLiveResourceJson } from "@/hooks/useLiveResource";

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

// Mark which services are coming soon
const comingSoonServices: Service[] = ['apple', 'youtube', 'tidal'];

export function SpotifyPlaylistSection({ 
    playlists: spotifyPlaylists, 
    tracks: spotifyTracks, 
    selectedPlaylistId: selectedSpotifyPlaylistId, 
    onPlaylistSelect: onSpotifyPlaylistSelect 
}: SpotifyPlaylistSectionProps) {
    const [mode, setMode] = useState<Mode>('playlist');
    const [selectedService, setSelectedService] = useState<Service>('spotify');
    const [selectedMainPlaylistId, setSelectedMainPlaylistId] = useState<number | undefined>(undefined);

    // Restore original state and effect logic for main playlists and tracks
    const [mainPlaylists, setMainPlaylists] = useState<any[]>([]);
    const [mainTracks, setMainTracks] = useState<any[]>([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(true);
    const [loadingTracks, setLoadingTracks] = useState(false);

    useEffect(() => {
        if (mode === 'playlist') {
            setLoadingPlaylists(true);
            fetch('http://localhost:3000/api/music/playlists')
                .then(res => res.json())
                .then((data) => {
                    // Filter out duplicates by id
                    const unique = Object.values(
                        data.reduce((acc: any, playlist: any) => {
                            acc[playlist.id] = playlist;
                            return acc;
                        }, {})
                    );
                    setMainPlaylists(unique);
                })
                .finally(() => setLoadingPlaylists(false));
        }
    }, [mode]);

    useEffect(() => {
        if (mode === 'playlist' && selectedMainPlaylistId !== undefined) {
            setLoadingTracks(true);
            fetch(`http://localhost:3000/api/music/playlists/tracks?id=${selectedMainPlaylistId}`)
                .then(res => res.json())
                .then(setMainTracks)
                .finally(() => setLoadingTracks(false));
        } else {
            setMainTracks([]);
            setLoadingTracks(false);
        }
    }, [mode, selectedMainPlaylistId]);

    const selectedServiceData = services.find(s => s.id === selectedService);

    return (
        <Card className="h-[600px] min-h-0">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{mode === 'playlist' ? 'Playlists' : 'Import from other services'}</CardTitle>
                    <CardDescription>
                        <span className="block min-h-[2.5em] hidden sm:block">
                            {mode === 'playlist'
                                ? (<>
                                    These are your main playlists.<br/>
                                    Any playlists you import will appear here and be visible publicly.
                                </>)
                                : 'Import playlists from a platform. Once imported, they will appear in your main playlists and be visible publicly.'}
                        </span>
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {mode === 'import' && (
                        <div className="ml-6 mt-2">
                            <Tabs value={selectedService} onValueChange={v => setSelectedService(v as Service)} className="w-auto">
                                <TabsList>
                                    {services.map(service => (
                                        <TabsTrigger
                                            key={service.id}
                                            value={service.id}
                                            className={`flex items-center gap-1 ${comingSoonServices.includes(service.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={comingSoonServices.includes(service.id)}
                                        >
                                            {service.icon}
                                            {service.label}
                                            {comingSoonServices.includes(service.id) && (
                                                <span className="ml-1 text-xs text-muted-foreground">(coming soon)</span>
                                            )}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full min-h-0">
                <div className="flex gap-4 flex-1 min-h-0">
                    {/* Playlist List */}
                    <div className="w-56 min-w-[180px] h-full overflow-y-auto border-r pr-2 flex flex-col min-h-0">
                        <div className="flex flex-col gap-2 flex-1 min-h-0">
                            {mode === 'playlist' ? (
                                loadingPlaylists ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 rounded">
                                            <Skeleton className="w-10 h-10 rounded" />
                                            <div className="flex-1">
                                                <Skeleton className="h-4 w-2/3 mb-2" />
                                                <Skeleton className="h-3 w-1/3" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    mainPlaylists.map((playlist: any) => (
                                        <div
                                            key={playlist.id}
                                            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${selectedMainPlaylistId === playlist.id ? 'bg-accent' : 'hover:bg-muted'}`}
                                            onClick={() => setSelectedMainPlaylistId(playlist.id)}
                                        >
                                            <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center">
                                                <IconBrandSpotify className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-sm truncate">{playlist.title}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {playlist.owner || 'No owner'}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )
                            ) : (
                                spotifyPlaylists.map(playlist => (
                                    <div
                                        key={playlist.id}
                                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${selectedSpotifyPlaylistId === playlist.id ? 'bg-accent' : 'hover:bg-muted'}`}
                                        onClick={() => onSpotifyPlaylistSelect(playlist.id)}
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
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="hover:bg-accent" 
                                                    tabIndex={-1} 
                                                    type="button" 
                                                    onClick={async e => {
                                                        e.stopPropagation();
                                                        const url = buildUrl('spotify/import', { id: playlist.id });
                                                        console.log('Import URL:', url);
                                                        try {
                                                            const response = await fetch(url, {
                                                                method: 'GET',
                                                                headers: { 'Content-Type': 'application/json' }
                                                            });
                                                            if (response.status === 200) {
                                                                toast.success('Playlist import started!');
                                                            } else {
                                                                toast.error('Failed to import playlist.');
                                                            }
                                                        } catch (err: any) {
                                                            toast.error('Failed to import playlist.');
                                                        }
                                                    }}
                                                >
                                                    <IconPlus className="w-5 h-5 text-muted-foreground" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="left" align="center">
                                                Import
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                ))
                            )}
                        </div>
                        {mode === 'import' && (
                            <Button
                                variant="outline"
                                className="w-full mt-4 flex items-center justify-center gap-2"
                                onClick={() => setMode('playlist')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                Back to your playlists
                            </Button>
                        )}
                    </div>
                    {/* Songs Table */}
                    <div className="flex-1 pl-4 min-w-0 h-full flex flex-col">
                        <div className="h-full overflow-y-auto min-h-0">
                            {mode === 'playlist' ? (
                                selectedMainPlaylistId ? (
                                    loadingTracks ? (
                                        <Table>
                                            <TableHeader className="sticky top-0">
                                                <TableRow>
                                                    <TableHead className="w-[100px]">Cover</TableHead>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead className="hidden sm:table-cell">Artist</TableHead>
                                                    <TableHead className="w-[100px] hidden sm:table-cell">Duration</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {Array.from({ length: 6 }).map((_, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell><Skeleton className="w-12 h-12 rounded-md" /></TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-4 w-2/3 mb-2" />
                                                            <Skeleton className="h-3 w-1/3" />
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <Skeleton className="h-4 w-1/2" />
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <Skeleton className="h-4 w-8" />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <Table>
                                            <TableHeader className="sticky top-0">
                                                <TableRow>
                                                    <TableHead className="w-[100px]">Cover</TableHead>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead className="hidden sm:table-cell">Artist</TableHead>
                                                    <TableHead className="w-[100px] hidden sm:table-cell">Duration</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {mainTracks.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center">No tracks found</TableCell>
                                                    </TableRow>
                                                ) : (
                                                    mainTracks.map((track: any) => (
                                                        <TableRow key={track.hash} className="group">
                                                            <TableCell>
                                                                {track.images?.[0]?.url ? (
                                                                    <div className="relative w-12 h-12 group-hover:scale-105 transition-transform">
                                                                        <img
                                                                            src={track.images[0].url}
                                                                            alt={track.title}
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
                                                                <div className="font-medium">{track.title}</div>
                                                                <div className="text-xs text-muted-foreground mt-0.5">{track.album}</div>
                                                            </TableCell>
                                                            <TableCell className="hidden sm:table-cell text-muted-foreground">
                                                                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                                                                    {track.artists?.map((artist: string, idx: number) => (
                                                                        <Tooltip key={artist + idx}>
                                                                            <TooltipTrigger asChild>
                                                                                <span className="focus:outline-none">
                                                                                    <Avatar>
                                                                                        <AvatarFallback>{artist.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                                                                                    </Avatar>
                                                                                </span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                {artist}
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ))}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="hidden sm:table-cell text-muted-foreground">
                                                                {formatDuration(track.duration)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    )
                                ) : (
                                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                                        Select a playlist to view tracks
                                    </div>
                                )
                            ) : (
                                selectedSpotifyPlaylistId ? (
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
                                            {spotifyTracks.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center">No tracks found</TableCell>
                                                </TableRow>
                                            ) : (
                                                spotifyTracks.map((track) => (
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
                                )
                            )}
                        </div>
                    </div>
                </div>
                {/* Place the Import More Playlists button always at the bottom of the card, only in playlist mode */}
                {mode === 'playlist' && (
                    <div className="pt-4">
                        <Button
                            variant="outline"
                            className="w-56 flex items-center justify-center gap-2"
                            onClick={() => setMode('import')}
                        >
                            <IconPlus className="w-4 h-4" />
                            Import more playlists
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 