"use client";

import React, { useEffect, useState } from "react";
import { UserAvatarProfile } from "@/components/ui/user-avatar-profile";
import { Separator } from "@/components/ui/separator";
import { UserContext, UserContextType } from "@/components/auth/UserContext";
import { Heading } from '@/components/ui/heading';
import PageContainer from "@/components/layout/page-container";
import { buildUrl, authorized } from '@/lib/api/apiClient';
import type { SpotifyAccount, SpotifyTrack, SpotifyPlaylist } from '@/lib/api/types';
import { MusicPlaylistImportResult, MusicPlaylistImportResultSchema, MusicTrackSchema, MusicTrack, MusicPlaylistMeta } from '@/lib/api/schemas';
import { useServerEvents } from '@/lib/api/ServerEvents';
import { useLiveResourceJson } from "@/hooks/useLiveResource";
import { ServiceCard, serviceIcons } from "@/components/ui/service-card";
import { MobileNavigationMenu } from "@/components/ui/mobile-navigation-menu";
import { PlaylistSection, PlaylistSectionSkeleton } from "@/components/ui/playlist/playlist-section";
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { FriendsCardSkeleton } from '@/components/ui/friends-card';
import FriendsCard from '@/components/ui/friends-card';

export default function AccountPage() {
    const userContext = React.useContext(UserContext) as UserContextType | null;
    const userAccount = userContext?.userAccount;
    

    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const tabIndex = tabParam === 'billing' ? 1 : 0;
    const [selectedTab, setSelectedTab] = React.useState<number>(tabIndex);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | undefined>(undefined);
    const [importedPlaylists, setImportedPlaylists] = useState<Array<MusicPlaylistMeta>>([]);
    const [isLoadingImportedPlaylists, setIsLoadingImportedPlaylists] = useState(true);

    const [tracks, setTracks] = useState<Array<MusicTrack>>([]);
    const [isLoadingTracks, setIsLoadingTracks] = useState(true);

    const hasSpotify = !!userAccount?.hasSpotify;

    const {
        data: spotifyAccountData,
        error: spotifyError
    } = useLiveResourceJson<SpotifyAccount>({
        fetchUrl: buildUrl('spotify/account'),
        eventName: 'SpotifyAccount',
        reconnectIntervalMs: 5000,
        shouldProcess: hasSpotify,
    }) as { data: SpotifyAccount | null, error: any };

    // Load my playlists using ServerEvents like in merge page
    useEffect(() => {
        let eventSource: EventSource | null = null;
        
        const loadPlaylists = async () => {
            try {
                setIsLoadingImportedPlaylists(true);
                eventSource = await useServerEvents<Array<MusicPlaylistImportResult>>(
                    buildUrl(`music/playlists`), 
                    'ImportedPlaylists', 
                    MusicPlaylistImportResultSchema.array(), 
                    (data) => {
                        setImportedPlaylists(data.map(item => item.meta));
                        setIsLoadingImportedPlaylists(false);
                    }
                );
            } catch (error) {
                console.error("Failed to connect to SSE:", error);
                setIsLoadingImportedPlaylists(false);
            }
        };
      
        if (hasSpotify) {
          loadPlaylists();
        }
      
        return () => { eventSource?.close() };
    }, []);

    // Load tracks for the selected playlist
    useEffect(() => {
        let eventSource: EventSource | null = null;
        setTracks([]);

        const loadTracks = async () => {
            try {
                setIsLoadingTracks(true);
                eventSource = await useServerEvents<Array<MusicTrack>>(
                    buildUrl(`music/playlists/tracks?id=${selectedPlaylistId}`), 
                    'ImportedPlaylistTracks', 
                    MusicTrackSchema.array(), 
                    (data) => {
                        setTracks((oldData) => [...oldData, ...data]);
                        setIsLoadingTracks(false);
                    }
                );
            } catch (error) {
                console.error("Failed to connect to SSE:", error);
                setIsLoadingTracks(false);
            }
        };
      
        if (hasSpotify && selectedPlaylistId !== undefined) {
            loadTracks();
        } else {
            setTracks([]);
            setIsLoadingTracks(false);
        }
      
        // Cleanup function to close the connection when component unmounts
        return () => { eventSource?.close() };
    }, [selectedPlaylistId, hasSpotify]);

    React.useEffect(() => {
        setSelectedTab(tabIndex);
    }, [tabIndex]);

    async function handleUnlinkSpotify() {
        const endpoint = `spotify/unlink`;
        await authorized.get(endpoint);
    }

    function handlePlaylistImported(playlist: MusicPlaylistMeta) {
        setImportedPlaylists(prev => [...prev, playlist]);
    }

    return (
        <PageContainer>
            <div className="flex flex-1 flex-col min-w-0 space-y-4 px-2 sm:px-4">
                {/* Header row only on larger screens */}
                <div className="hidden sm:flex items-center gap-4 w-full min-w-0">
                    <UserAvatarProfile
                        username={userAccount?.username}
                        profilePicture={userAccount?.profilePicture}
                    />
                    <Heading
                        title={userAccount?.username as string}
                        description='Account'
                    />
                </div>

                <MobileNavigationMenu selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                <Separator />

                <div className="flex flex-1 flex-col gap-4 mt-4 sm:flex-row sm:gap-6 min-w-0">
                    {/* Vertical Tabs only on larger screens */}
                    <div className="hidden sm:flex flex-col w-40 border-r pr-4 flex-shrink-0 min-w-0">
                        <button
                            className={`py-2 px-4 text-left rounded-lg mb-2 transition-colors ${selectedTab === 0 ? 'bg-muted font-semibold' : 'hover:bg-accent'}`}
                            onClick={() => setSelectedTab(0)}
                        >
                            Overview
                        </button>
                        <button
                            className={`py-2 px-4 text-left rounded-lg transition-colors ${selectedTab === 1 ? 'bg-muted font-semibold' : 'hover:bg-accent'}`}
                            onClick={() => setSelectedTab(1)}
                        >
                            Billing
                        </button>
                    </div>
                    {/* Tab Content */}
                    <div className="flex-1 min-w-0">
                        {selectedTab === 0 && (
                            <>
                                {/* Service cards: responsive grid */}
                                <div
                                    className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-4  mb-6 min-w-0 auto-rows-[1fr] "
                                >
                                    {serviceIcons.map(service => {
                                        const isConnected = userAccount ? (userAccount as any)[service.key] : false;
                                        return (
                                            <ServiceCard
                                                key={service.key}
                                                service={service}
                                                isConnected={isConnected}
                                                userAccount={userAccount}
                                                spotifyAccountData={spotifyAccountData}
                                                spotifyError={spotifyError}
                                                onUnlink={handleUnlinkSpotify}
                                            />
                                        );
                                    })}
                                </div>


                                <div className="flex flex-col xl:flex-row gap-4 w-full h-auto min-h-0 min-w-0">
                                    <div className="w-full max-w-md mx-auto xl:max-w-none xl:mx-0 xl:w-[345px] xl:flex-shrink-0">
                                        <FriendsCard forceFullHeight/>
                                    </div>
                                    {userAccount?.hasSpotify && (
                                        <div className="w-full xl:flex-1">
                                            {isLoadingImportedPlaylists ? (
                                                <PlaylistSectionSkeleton />
                                            ) : (
                                                <PlaylistSection
                                                    mainPlaylists={importedPlaylists}
                                                    mainTracks={tracks}
                                                    mainPlaylistsLoading={isLoadingImportedPlaylists}
                                                    selectedMainPlaylistId={selectedPlaylistId}
                                                    onMainPlaylistSelect={setSelectedPlaylistId}
                                                    onPlaylistImported={handlePlaylistImported}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {selectedTab === 1 && (
                            <div className="text-center text-muted-foreground">
                                Billing features coming soon
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </PageContainer>
    );
}
