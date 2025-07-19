import React, { useState, type ReactNode } from 'react';
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
    IconArrowLeft, IconList
} from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Tabs,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import type { SpotifyTrack, SpotifyPlaylist, MusicPlaylistImportResult } from '@/lib/api/types';
import { authorized, buildUrl } from '@/lib/api/apiClient';
import { toast } from 'sonner';
import { useLiveResourceJson } from '@/hooks/useLiveResource';
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRef, useEffect } from 'react';
import {Table, TableHead, TableHeader, TableRow} from "@/components/ui/table";
interface PlaylistSectionProps {
    mainPlaylists: any[];
    mainTracks: any[];
    mainPlaylistsLoading?: boolean;
    selectedMainPlaylistId: number | undefined;
    onMainPlaylistSelect: (id?: number) => void;
    hideTracksSection?: boolean;
    showRadioButtons?: boolean;
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

function PlaylistSectionHeaderCompact({
                                          importedView,
                                          setImportedView,
                                          selectedService,
                                          setSelectedService,
                                          services,
                                          comingSoonServices,
                                          hideTracksSection = false,
                                      }: {
    importedView: boolean;
    setImportedView: React.Dispatch<React.SetStateAction<boolean>>;
    selectedService: Service;
    setSelectedService: (v: Service) => void;
    services: { id: Service; key: string; label: string; icon: ReactNode }[];
    comingSoonServices: Service[];
    hideTracksSection?: boolean;
}) {
    return (
        <CardHeader className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2 w-full justify-between">
                <CardTitle>{importedView ? 'Import' : 'Playlists'}</CardTitle>
                <div className="flex items-center gap-2">
                    {importedView && !hideTracksSection && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {services.find(s => s.id === selectedService)?.label || 'Select Service'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {services.map(service => (
                                    <DropdownMenuItem
                                        key={service.id}
                                        onClick={() => setSelectedService(service.id)}
                                        disabled={comingSoonServices.includes(service.id)}
                                    >
                                        <span className="flex items-center gap-1">
                                            {service.icon}
                                            {service.label}
                                            {comingSoonServices.includes(service.id) && (
                                                <span className="ml-1 text-xs text-muted-foreground">(coming soon)</span>
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {!hideTracksSection && (
                        <Button
                            variant="outline"
                            onClick={() => setImportedView(prev => !prev)}
                            size="icon"
                            aria-label={!importedView ? "Import more playlists" : "Back to your playlists"}
                        >
                            {!importedView ? (
                                <IconPlus className="w-4 h-4" />
                            ) : (
                                <IconArrowLeft className="w-4 h-4" />
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </CardHeader>
    );
}

function PlaylistSectionHeaderRegular({
                                          importedView,
                                          setImportedView,
                                          selectedService,
                                          setSelectedService,
                                          services,
                                          comingSoonServices,
                                          hideTracksSection = false,
                                      }: {
    importedView: boolean;
    setImportedView: React.Dispatch<React.SetStateAction<boolean>>;
    selectedService: Service;
    setSelectedService: (v: Service) => void;
    services: { id: Service; key: string; label: string; icon: React.ReactNode }[];
    comingSoonServices: Service[];
    hideTracksSection?: boolean;
}) {
    const tabsListRef = useRef<HTMLDivElement>(null);

    const [hideServiceLabel, setHideServiceLabel] = useState(false);
    const [useDropdown, setUseDropdown] = useState(false);
    const [hideComingSoon, setHideComingSoon] = useState(false);

    useEffect(() => {
        function updateVisibility() {
            if (!tabsListRef.current) return;

            const width = tabsListRef.current.scrollWidth;

            setHideComingSoon(width <= 965);
            setHideServiceLabel(width <= 703);
            setUseDropdown(width <= 483);
        }

        updateVisibility();
        window.addEventListener("resize", updateVisibility);
        return () => window.removeEventListener("resize", updateVisibility);
    }, []);

    return (
        <CardHeader
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-2"
            ref={tabsListRef}
        >
            <CardTitle className="text-xl">{importedView ? "Import" : "Playlists"}</CardTitle>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                {importedView && !hideTracksSection && (
                    <>
                        {useDropdown ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full sm:w-auto">
                                        {services.find((s) => s.id === selectedService)?.label || "Select Service"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {services.map((service) => {
                                        const isComingSoon = comingSoonServices.includes(service.id);
                                        return (
                                            <DropdownMenuItem
                                                key={service.id}
                                                onClick={() => setSelectedService(service.id)}
                                                disabled={isComingSoon}
                                            >
                        <span className="flex items-center gap-1">
                          {service.icon}
                            {service.label}
                            {isComingSoon && (
                                <span className="ml-1 text-xs text-muted-foreground">(coming soon)</span>
                            )}
                        </span>
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Tabs
                                value={selectedService}
                                onValueChange={(v) => setSelectedService(v as Service)}
                                className="w-full sm:w-auto"
                            >
                                <TabsList className="flex flex-wrap">
                                    {services.map((service) => {
                                        const isComingSoon = comingSoonServices.includes(service.id);
                                        return (
                                            <TabsTrigger
                                                key={service.id}
                                                value={service.id}
                                                className={`flex items-center gap-1 whitespace-nowrap ${
                                                    isComingSoon ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                                disabled={isComingSoon}
                                            >
                                                {service.icon}
                                                {!hideServiceLabel && service.label}
                                                {!hideComingSoon && isComingSoon && (
                                                    <span className="ml-1 text-xs text-muted-foreground">(coming soon)</span>
                                                )}
                                            </TabsTrigger>
                                        );
                                    })}
                                </TabsList>
                            </Tabs>
                        )}
                    </>
                )}

                <div className="flex items-center gap-2">
                    {!hideTracksSection && (
                        <Button
                            variant="outline"
                            onClick={() => setImportedView((prev) => !prev)}
                            className="hidden sm:inline-flex"
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
                    )}
                    {!hideTracksSection && (
                        <Button
                            variant="outline"
                            onClick={() => setImportedView((prev) => !prev)}
                            className="sm:hidden"
                            size="icon"
                            aria-label={!importedView ? "Import more playlists" : "Back to your playlists"}
                        >
                            {!importedView ? <IconPlus className="w-4 h-4" /> : <IconArrowLeft className="w-4 h-4" />}
                        </Button>
                    )}
                </div>
            </div>
        </CardHeader>
    );
}

// Hook to detect if an element is overflowing horizontally
function useElementOverflow<T extends HTMLElement>() {
    const ref = useRef<T | null>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        function checkOverflow() {
            if (ref.current) {
                setIsOverflowing(ref.current.scrollWidth > ref.current.clientWidth);
            }
        }
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, []);

    return [ref, isOverflowing] as const;
}

// PlaylistSectionSkeleton component for comprehensive loading state
export function PlaylistSectionSkeleton() {
    return (
        <Card className="h-[600px] min-h-0">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-2">
                <Skeleton className="h-6 w-24" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-40" />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex gap-2">
                    {/* Playlist list skeleton */}
                    <div className="w-72 min-w-[220px] h-[45vh] overflow-y-auto border-r pr-1 flex flex-col justify-between">
                        <div className="flex flex-col gap-0">
                            {Array.from({length: 6}).map((_, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3">
                                    <Skeleton className="h-12 w-12 rounded-md" />
                                    <div className="flex-1 min-w-0">
                                        <Skeleton className="h-4 w-3/4 mb-1" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tracks table skeleton */}
                    <div className="flex-1 pl-0">
                        <div className="space-y-2 p-4">
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-md" />
                                    <div className="flex-1 min-w-0">
                                        <Skeleton className="h-4 w-2/3 mb-1" />
                                        <Skeleton className="h-3 w-1/3" />
                                    </div>
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function PlaylistSection({
                                    mainPlaylists,
                                    mainTracks,
                                    mainPlaylistsLoading = false,
                                    selectedMainPlaylistId,
                                    onMainPlaylistSelect,
                                    hideTracksSection = false,
                                    showRadioButtons = false,
                                }: PlaylistSectionProps) {

    const router = useRouter();
    const [selectedService, setSelectedService] = useState<Service>('spotify');
    // false = normal playlist view, true = import view
    const [importedView, setImportedView] = useState(false);
    const [showNoPlaylists, setShowNoPlaylists] = useState(false);
    const [importingPlaylist, setImportingPlaylist] = useState<string | null>(null);
    const [selectedSpotifyPlaylistId, setSelectedSpotifyPlaylistId] = useState<string | undefined>(undefined);

    const {
        data: rawImportPlaylist,
        error: spotifyPlaylistsError
      } = useLiveResourceJson<MusicPlaylistImportResult>({
        fetchUrl: buildUrl(`spotify/import?id=${importingPlaylist}`),
        eventName: 'SpotifyPlaylistImport',
        reconnectIntervalMs: 5000,
        shouldProcess: importingPlaylist != null,
        onMessage: (data) => {
            const response = typeof data === 'object' && data.status === 'success'
              ? [data as MusicPlaylistImportResult]
              : [];

              console.log("Selected Spotify Playlist ID: ", importingPlaylist + ", " + selectedSpotifyPlaylistId);
              processedSpotifyTracks = processedSpotifyTracks.filter((playlist) => playlist.id !== importingPlaylist);
              toast.success('Playlist imported successfully!');
              setImportingPlaylist(null);
              setSelectedSpotifyPlaylistId(undefined);

              //todo: remove from the view
          }
      });
    

    // Delay showing "no playlists" message to prevent premature empty states
    useEffect(() => {
        if (mainPlaylistsLoading) {
            setShowNoPlaylists(false);
            return;
        }

        if (mainPlaylists.length === 0) {
            const timer = setTimeout(() => {
                setShowNoPlaylists(true);
            }, 2000); // 2 second delay

            return () => clearTimeout(timer);
        } else {
            setShowNoPlaylists(false);
        }
    }, [mainPlaylists.length, mainPlaylistsLoading]);

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
        fetchUrl: selectedSpotifyPlaylistId ? buildUrl(`spotify/tracks?id=${selectedSpotifyPlaylistId}`) : "",
        eventName: 'SpotifyPlaylistTracks',
        reconnectIntervalMs: 5000,
        shouldProcess: importedView && !!selectedSpotifyPlaylistId,
    });

    var processedSpotifyTracks: SpotifyTrack[] = Array.isArray(rawSpotifyTracks)
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

    const isMobile = useIsMobile();

    // Overflow detection for CardHeader
    const [headerRef, isHeaderOverflowing] = useElementOverflow<HTMLDivElement>();
    const forceCompactHeader = isHeaderOverflowing;

    return (
        <Card className="h-[600px] min-h-0">
            <div ref={headerRef}>
                {(isMobile) ? (
                    <PlaylistSectionHeaderCompact
                        importedView={importedView}
                        setImportedView={setImportedView}
                        selectedService={selectedService}
                        setSelectedService={setSelectedService}
                        services={services}
                        comingSoonServices={comingSoonServices}
                        hideTracksSection={hideTracksSection}
                    />
                ) : (
                    <PlaylistSectionHeaderRegular
                        importedView={importedView}
                        setImportedView={setImportedView}
                        selectedService={selectedService}
                        setSelectedService={setSelectedService}
                        services={services}
                        comingSoonServices={comingSoonServices}
                        hideTracksSection={hideTracksSection}
                    />
                )}
            </div>
            <CardContent className="p-0 flex-1 min-h-0">
                <div className={`flex gap-2 h-full${hideTracksSection ? '' : ''}`}>
                    <div
                        className={`w-72 min-w-[220px] overflow-y-auto flex flex-col ${hideTracksSection ? 'items-center border-r-0 pr-0' : 'border-r pr-1'}`}
                    >
                        <div className={`flex flex-col gap-0 ${hideTracksSection ? 'w-full' : ''}`}>
                            {!importedView && (mainPlaylistsLoading || (!showNoPlaylists && mainPlaylists.length === 0)) ? (
                                // Enhanced skeleton while main playlists loading or during delay
                                Array.from({length: 6}).map((_, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3">
                                        <Skeleton className="h-12 w-12 rounded-md" />
                                        <div className="flex-1 min-w-0">
                                            <Skeleton className="h-4 w-3/4 mb-1" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                ))
                            ) : null}
                            {!importedView && mainPlaylists.length === 0 && showNoPlaylists && !mainPlaylistsLoading && (
                                <div
                                    className="flex items-center justify-center py-8 text-muted-foreground text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <IconMusic className="w-8 h-8 text-muted-foreground/50" />
                                        <p>No playlists found</p>
                                        <p className="text-sm">Press Import to add playlists</p>
                                    </div>
                                </div>
                            )}
                            {isSpotifyPlaylistsLoading ? (
                                // Enhanced skeletons while importing spotify playlists list loads
                                Array.from({length: 6}).map((_, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 hover:bg-accent/50 cursor-pointer">
                                        <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <Skeleton className="h-4 w-3/4 mb-1" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                        <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
                                    </div>
                                ))
                            ) : !importedView ? (
                                mainPlaylists.length > 0 && mainPlaylists.map(playlist => (
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
                                                rightElement={showRadioButtons ? (
                                                    <div 
                                                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0 cursor-pointer ${
                                                            selectedMainPlaylistId === playlist.id 
                                                                ? 'bg-primary' 
                                                                : 'border-2 border-muted-foreground/30 hover:border-muted-foreground/50'
                                                        }`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onMainPlaylistSelect(playlist.id);
                                                        }}
                                                    >
                                                        {selectedMainPlaylistId === playlist.id && (
                                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                ) : undefined}
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
                                                        className="hover:bg-accent hover:[&>svg]:text-white"
                                                        tabIndex={-1}
                                                        type="button"
                                                        disabled={importingPlaylist !== null}
                                                        onClick={async e => {
                                                            e.stopPropagation();
                                                            const playlistId = playlist.id;
                                                            
                                                            // Set the currently importing playlist
                                                            setImportingPlaylist(playlistId);
                                                            
                                                            const url = buildUrl('spotify/import', { id: playlistId });
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
                                                        {importingPlaylist === playlist.id ? (
                                                            <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <IconPlus className="w-5 h-5 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="left" align="center">
                                                    {importingPlaylist === playlist.id ? 'Importing...' : 'Import'}
                                                </TooltipContent>
                                            </Tooltip>
                                        }
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {!hideTracksSection && (
                        <div className="flex-1 pl-0 overflow-hidden">
                            <div className="h-full overflow-y-auto">
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
                    )}
                </div>
            </CardContent>
        </Card>
    );
}