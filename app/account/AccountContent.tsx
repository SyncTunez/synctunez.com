"use client";

import React, { Suspense, useEffect, useState } from "react";
import { UserAvatarProfile } from "@/components/ui/user-avatar-profile";
import { Separator } from "@/components/ui/separator";
import { UserContext, UserContextType } from "@/components/auth/UserContext";
import { Heading } from '@/components/ui/heading';
import PageContainer from "@/components/layout/page-container";
import { buildUrl, authorized } from '@/lib/api/apiClient';
import type { SpotifyAccount, SpotifyTrack, SpotifyPlaylist } from '@/lib/api/types';
import { useLiveResourceJson } from "@/hooks/useLiveResource";
import { ServiceCard, serviceIcons } from "@/components/ui/service-card";
import { MobileNavigationMenu } from "@/components/ui/mobile-navigation-menu";
import { SpotifyPlaylistSection } from "@/components/ui/spotify-playlist-section";
import { FriendsCard } from "@/components/ui/friends-card";
import { useSearchParams } from 'next/navigation';
import {CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "cmdk";

export default function AccountContent() {
    const userContext = React.useContext(UserContext) as UserContextType | null;
    const userAccount = userContext?.userAccount;
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const tabIndex = tabParam === 'billing' ? 1 : 0;
    const [selectedTab, setSelectedTab] = React.useState<number>(tabIndex);
    const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | undefined>(undefined);

    const {
        data: spotifyAccountData,
        error: spotifyError
    } = useLiveResourceJson<SpotifyAccount>({
        fetchUrl: buildUrl('spotify/account'),
        eventName: 'SpotifyAccount',
        reconnectIntervalMs: 5000
    }) as { data: SpotifyAccount | null, error: any };

    const {
        data: spotifyPlayLists,
        error: spotifyPlaylistError
    } = useLiveResourceJson<SpotifyPlaylist>({
        fetchUrl: buildUrl('spotify/playlists'),
        eventName: 'SpotifyPlaylist',
        reconnectIntervalMs: 5000,
        onMessage: (data, event) => {
            setPlaylists((prev: SpotifyPlaylist[]): SpotifyPlaylist[] => {
                const exists = prev.some(p => p.id === data.id);
                return exists ? prev : [...prev, data];
            });
        }
    });

    const {
        data: spotifyTracks,
        error: spotifyTracksError
    } = useLiveResourceJson<SpotifyTrack>({
        fetchUrl: selectedPlaylistId ? buildUrl(`spotify/tracks?id=${selectedPlaylistId}`) : '',
        eventName: 'SpotifyPlaylistTracks',
        reconnectIntervalMs: 5000,
        onMessage: (data, event) => {
            setTracks((prev: SpotifyTrack[]): SpotifyTrack[] => {
                const exists = prev.some(p => p.id === data.id);
                return exists ? prev : [...prev, data.track];
            });
        }
    });

    useEffect(() => {
        setTracks([]);
    }, [selectedPlaylistId]);

    // Keep selectedTab in sync with tab param
    React.useEffect(() => {
        setSelectedTab(tabIndex);
    }, [tabIndex]);

    async function handleUnlinkSpotify() {
        const endpoint = `spotify/unlink`;
        await authorized.get(endpoint);
    }

    return (
        <PageContainer>
            <div className='flex flex-1 flex-col space-y-4 px-2 sm:px-4'>
                {/* Show header row only on larger screens */}
                <div className="hidden sm:flex items-center gap-4 w-full">
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
                <Separator/>

                <div className="flex flex-1 flex-col gap-4 mt-4 sm:flex-row sm:gap-6">
                    {/* Vertical Tabs only on larger screens */}
                    <div className="hidden sm:flex flex-col w-40 border-r pr-4 flex-shrink-0">
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
                                <div className="grid gap-4 mb-6 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 auto-rows-[1fr] grid-flow-row min-w-0 overflow-x-auto">
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

                                <div className="flex flex-col gap-4 w-full sm:flex-row sm:gap-4 h-auto min-h-0">
                                    <div className="w-full sm:w-80 flex flex-col mb-4 sm:mb-0 sm:h-auto sm:min-h-0">
                                        <FriendsCard forceFullHeight />
                                    </div>
                                    {userAccount?.hasSpotify && (
                                        <div className="flex-1 h-auto min-w-0 flex flex-col overflow-x-auto">
                                            <SpotifyPlaylistSection
                                                playlists={playlists}
                                                tracks={tracks}
                                                selectedPlaylistId={selectedPlaylistId}
                                                onPlaylistSelect={setSelectedPlaylistId}
                                            />
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