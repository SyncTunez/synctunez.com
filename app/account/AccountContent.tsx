"use client";

import React, { useEffect, useState } from "react";
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
import { PlaylistSection } from "@/components/ui/playlist/playlist-section";
import { FriendsCard } from "@/components/ui/friends-card";
import { useSearchParams } from 'next/navigation';

export default function AccountContent() {
    const userContext = React.useContext(UserContext) as UserContextType | null;
    const userAccount = userContext?.userAccount;
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const tabIndex = tabParam === 'billing' ? 1 : 0;
    const [selectedTab, setSelectedTab] = React.useState<number>(tabIndex);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | undefined>(undefined);

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

    const {
        data: rawPlaylists,
        error: musicPlaylistError
    } = useLiveResourceJson<SpotifyPlaylist>({
        fetchUrl: buildUrl('music/playlists'),
        eventName: 'ImportedPlaylists',
        reconnectIntervalMs: 5000,
        shouldProcess: hasSpotify,
    });

    const playlistsLoading = rawPlaylists === undefined;

    const playlists: SpotifyPlaylist[] = Array.isArray(rawPlaylists)
        ? rawPlaylists
        : rawPlaylists && typeof rawPlaylists === 'object' && 'id' in rawPlaylists
            ? [rawPlaylists as SpotifyPlaylist]
            : [];

    const {
        data: rawSpotifyTracks,
        error: spotifyTracksError
    } = useLiveResourceJson<SpotifyTrack>({
        fetchUrl: selectedPlaylistId !== undefined ? buildUrl(`music/playlists/tracks?id=${selectedPlaylistId}`) : '',
        eventName: 'ImportedPlaylistTracks',
        reconnectIntervalMs: 5000,
        shouldProcess: selectedPlaylistId !== undefined,
    });

    const tracks: SpotifyTrack[] = Array.isArray(rawSpotifyTracks)
        ? rawSpotifyTracks.map((entry: any) => entry.track || entry)
        : [];

    React.useEffect(() => {
        setSelectedTab(tabIndex);
    }, [tabIndex]);

    async function handleUnlinkSpotify() {
        const endpoint = `spotify/unlink`;
        await authorized.get(endpoint);
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


                                <div className="flex flex-wrap gap-4 w-full h-auto min-h-0 min-w-0">
                                    <div className="flex-shrink min-w-[280px] flex-grow flex flex-col overflow-x-auto w-full max-w-full sm:max-w-[345px]">
                                        <FriendsCard forceFullHeight/>
                                    </div>
                                    {userAccount?.hasSpotify && (
                                        <div
                                            className="flex-shrink min-w-[280px] flex-grow flex flex-col overflow-x-auto">
                                            <PlaylistSection
                                                mainPlaylists={playlists}
                                                mainTracks={tracks}
                                                mainPlaylistsLoading={playlistsLoading}
                                                selectedMainPlaylistId={selectedPlaylistId}
                                                onMainPlaylistSelect={setSelectedPlaylistId}
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
