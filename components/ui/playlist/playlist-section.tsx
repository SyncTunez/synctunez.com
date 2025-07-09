import { useState, type ReactNode } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
// Removed direct Table imports as TrackTable now handles table rendering
import { TrackTable } from "@/components/ui/playlist/track-table";
import { PlaylistRow } from "@/components/ui/playlist/playlist-row";
import { Button } from "@/components/ui/button";
import {
    IconMusic,
    IconBrandSpotify, 
    IconBrandApple,
    IconBrandYoutube,
    IconBrandTidal,
    IconPlus,
    IconArrowLeft
} from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Tabs,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import type { SpotifyTrack, SpotifyPlaylist } from '@/lib/api/types';
import { authorized, buildUrl } from '@/lib/api/apiClient';
import { toast } from 'sonner';
import { useLiveResourceJson } from '@/hooks/useLiveResource';
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation';

interface PlaylistSectionProps {
    mainPlaylists: any[];
    mainTracks: any[];
    mainPlaylistsLoading?: boolean;
    selectedMainPlaylistId: number | undefined;
    onMainPlaylistSelect: (id?: number) => void;
}

type Service = 'spotify' | 'apple' | 'youtube' | 'tidal';

const services: { id: Service; key: string; label: string; icon: ReactNode }[] = [
    { id: 'spotify', key: 'hasSpotify', label: 'Spotify', icon: <IconBrandSpotify className="w-4 h-4 text-green-500" /> },
    { id: 'apple', key: 'hasApple', label: 'Apple Music', icon: <IconBrandApple className="w-4 h-4 text-gray-500" /> },
    { id: 'youtube', key: 'hasYoutube', label: 'YouTube', icon: <IconBrandYoutube className="w-4 h-4 text-red-500" /> },
    { id: 'tidal', key: 'hasTidal', label: 'Tidal', icon: <IconBrandTidal className="w-4 h-4 text-blue-500" /> },
];

// Mark which services are coming soon
const comingSoonServices: Service[] = ['apple', 'youtube', 'tidal'];

export function PlaylistSection({
    mainPlaylists,
    mainTracks,
    mainPlaylistsLoading = false,
    selectedMainPlaylistId,
    onMainPlaylistSelect
}: PlaylistSectionProps) {

    const router = useRouter();
    const [selectedService, setSelectedService] = useState<Service>('spotify');
    // false = normal playlist view, true = import view
    const [importedView, setImportedView] = useState(false);

    const [selectedSpotifyPlaylistId, setSelectedSpotifyPlaylistId] = useState<string | undefined>(undefined);

    const {
        data: rawSpotifyPlaylists
    } = useLiveResourceJson<SpotifyPlaylist>({
        fetchUrl: buildUrl('spotify/playlists'),
        eventName: 'SpotifyPlaylist',
        reconnectIntervalMs: 5000,
        shouldProcess: importedView,
    });

    const {
        data: rawSpotifyTracks
    } = useLiveResourceJson<SpotifyTrack>({
        fetchUrl: selectedSpotifyPlaylistId ? buildUrl(`spotify/tracks?id=${selectedSpotifyPlaylistId}`) : '',
        eventName: 'SpotifyPlaylistTracks',
        reconnectIntervalMs: 5000,
        shouldProcess: importedView && !!selectedSpotifyPlaylistId,
    });

    const processedSpotifyTracks: SpotifyTrack[] = Array.isArray(rawSpotifyTracks)
        ? rawSpotifyTracks.map((entry: any) => entry.track || entry)
        : [];

    // Loading states
    const isSpotifyPlaylistsLoading = importedView && !Array.isArray(rawSpotifyPlaylists);
    const isTracksLoading = (() => {
        const isPlaylistMode = !importedView;
        const hasSelection = isPlaylistMode ? !!selectedMainPlaylistId : !!selectedSpotifyPlaylistId;
        if (!hasSelection) return false;
        if (isPlaylistMode) {
            return mainTracks.length === 0;
        }
        return processedSpotifyTracks.length === 0;
    })();

    return (
        <Card className="h-[600px] min-h-0">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{importedView ? 'Import from other services' : 'Playlists'}</CardTitle>
                    <CardDescription>
                        <span className="block min-h-[2.5em]">
                            {!importedView
                                ? (<>
                                    These are your main playlists.<br/>
                                    Any playlists you import will appear here and be visible publicly.
                                </>)
                                : 'Import playlists from a platform. Once imported, they will appear in your main playlists and be visible publicly.'}
                        </span>
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {importedView && (
                        <div className="ml-6 mt-2">
                            <Tabs value={selectedService} onValueChange={v => setSelectedService(v as Service)}
                                  className="w-auto">
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
            <CardContent>
                <div className="flex gap-4">
                    <div
                        className="w-56 min-w-[180px] h-[50vh] overflow-y-auto border-r pr-2 flex flex-col justify-between">
                        <div className="flex flex-col gap-2">
                            {!importedView && mainPlaylists.length === 0 && mainPlaylistsLoading ? (
                                // skeleton while main playlists loading
                                Array.from({ length: 6 }).map((_, idx) => (
                                    <Skeleton key={idx} className="h-12 w-full" />
                                ))
                            ) : null}
                            {!importedView && mainPlaylists.length === 0 && !mainPlaylistsLoading && (
                                <div className="flex items-center justify-center py-2 text-muted-foreground text-center">
                                    No playlists found. Press Import to add.
                                </div>
                            )}
                            {isSpotifyPlaylistsLoading ? (
                                // Skeletons while importing spotify playlists list loads
                                Array.from({ length: 6 }).map((_, idx) => (
                                    <Skeleton key={idx} className="h-12 w-full" />
                                ))
                            ) : !importedView ? (
                                mainPlaylists.map(playlist => (
                                    <ContextMenu key={playlist.id}>
                                        <ContextMenuTrigger asChild>
                                            <PlaylistRow
                                                imageUrl={playlist.image?.url}
                                                defaultIcon={<IconMusic className="w-6 h-6 text-muted-foreground" />}
                                                title={playlist.title}
                                                subtitle={(() => {
                                                    const src = playlist.from || 'Unknown';
                                                    return src.charAt(0).toUpperCase() + src.slice(1);
                                                })()}
                                                selected={selectedMainPlaylistId === playlist.id}
                                                onClick={() => onMainPlaylistSelect(playlist.id)}
                                            />
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem
                                                variant="destructive"
                                                onClick={async () => {
                                                    try {
                                                        await authorized.get(`music/playlists/remove?id=${playlist.id}`);
                                                        toast.success('Playlist removed');
                                                        if (selectedMainPlaylistId === playlist.id) {
                                                            onMainPlaylistSelect(undefined);
                                                        }
                                                        router.refresh();
                                                    } catch (err) {
                                                        toast.error('Failed to remove playlist');
                                                    }
                                                }}
                                            >
                                                Remove Playlist
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                ))
                            ) : (
                                Array.isArray(rawSpotifyPlaylists) && rawSpotifyPlaylists.map(playlist => (
                                    <PlaylistRow
                                        key={playlist.id}
                                        imageUrl={playlist.images?.[0]?.url}
                                        defaultIcon={<IconBrandSpotify className="w-6 h-6 text-muted-foreground" />}
                                        title={playlist.name ?? ''}
                                        subtitle={playlist.description || 'No description'}
                                        selected={selectedSpotifyPlaylistId === playlist.id}
                                        onClick={() => setSelectedSpotifyPlaylistId(playlist.id)}
                                        rightElement={
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
                                        }
                                    />
                                ))
                            )}
                        </div>
                        <Button
                            variant="outline"
                            className="w-full mt-4 flex items-center justify-center gap-2"
                            onClick={() => setImportedView(prev => !prev)}
                        >
                            {!importedView ? (
                                <>
                                    <IconPlus className="w-4 h-4" />
                                    Import more playlists
                                </>
                            ) : (
                                <>
                                    <IconArrowLeft className="w-4 h-4" />
                                    Back to your playlists
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="flex-1 pl-4">
                        <div className="h-[50vh] overflow-y-auto">
                            {(() => {
                                const isPlaylistMode = !importedView;
                                const hasSelection = isPlaylistMode ? !!selectedMainPlaylistId : !!selectedSpotifyPlaylistId;
                                const tracksToShow = isPlaylistMode ? (hasSelection ? mainTracks : [])
                                    : (hasSelection ? processedSpotifyTracks : []);
                                const emptyLabel = hasSelection ? 'No tracks found' : 'Select a playlist to view tracks';
                                if (isTracksLoading) {
                                    return (
                                        <div className="space-y-2">
                                            {Array.from({ length: 6 }).map((_, idx) => (
                                                <Skeleton key={idx} className="h-12 w-full" />
                                            ))}
                                        </div>
                                    );
                                }
                                return (
                                    <TrackTable
                                        tracks={tracksToShow}
                                        isSpotify={!isPlaylistMode}
                                        emptyLabel={emptyLabel}
                                    />
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 