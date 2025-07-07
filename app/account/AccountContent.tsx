"use client";

import React, {Suspense, useEffect, useState} from "react";
import { UserAvatarProfile } from "@/components/ui/user-avatar-profile";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    IconBrandSpotify,
    IconBrandApple,
    IconBrandYoutube,
    IconBrandTidal,
    IconEdit,
    IconPlus,
    IconUnlink
} from "@tabler/icons-react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { UserContext, UserContextType } from "@/components/auth/UserContext";
import { Heading } from '@/components/ui/heading';
import PageContainer from "@/components/layout/page-container";
import { buildUrl } from '@/lib/api/apiClient';
import type { SpotifyAccount } from '@/lib/api/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { authorized } from '@/lib/api/apiClient';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";

const serviceIcons = [
    { key: "hasSpotify", label: "Spotify", icon: <IconBrandSpotify className="text-green-500" /> },
    { key: "hasApple", label: "Apple Music", icon: <IconBrandApple className="text-gray-500" /> },
    { key: "hasYoutube", label: "YouTube", icon: <IconBrandYoutube className="text-red-500" /> },
    { key: "hasTidal", label: "Tidal", icon: <IconBrandTidal className="text-blue-500" /> },
];

// NavigationMenu for mobile
function MobileNavigationMenu({ selectedTab, setSelectedTab }: { selectedTab: number, setSelectedTab: (tab: number) => void }) {
    return (
        <nav className="sm:hidden w-full flex justify-center mb-4">
            <div className="flex rounded-lg border bg-card shadow-sm overflow-hidden">
                <button
                    className={`px-4 py-2 text-sm font-medium transition-colors ${selectedTab === 0 ? 'bg-accent text-accent-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                    onClick={() => setSelectedTab(0)}
                >
                    Overview
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium transition-colors ${selectedTab === 1 ? 'bg-accent text-accent-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                    onClick={() => setSelectedTab(1)}
                >
                    Billing
                </button>
            </div>
        </nav>
    );
}

export default function AccountContent() {
    const userContext = React.useContext(UserContext) as UserContextType | null;
    const userAccount = userContext?.userAccount;
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const tabIndex = tabParam === 'billing' ? 1 : 0;
    const [selectedTab, setSelectedTab] = React.useState(tabIndex);
    const [cardsSwapped, setCardsSwapped] = React.useState(false);

    // Spotify ID state
    const [spotifyAccount, setSpotifyAccount] = useState<SpotifyAccount | null>(null);
    const [isLoadingSpotify, setIsLoadingSpotify] = useState(false);
    const [spotifyError, setSpotifyError] = useState(false);
    const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
    const [isUnlinking, setIsUnlinking] = useState(false);

    useEffect(() => {
        const fetchSpotifyAccount = async () => {
            if (userAccount?.hasSpotify && !spotifyAccount) {
                setIsLoadingSpotify(true);
                setSpotifyError(false);
                try {
                    const res = await authorized.get('spotify/account');
                    if (res.status === 200) {
                        setSpotifyAccount(res.data as SpotifyAccount);
                    } else {
                        setSpotifyError(true);
                    }
                } catch {
                    setSpotifyAccount(null);
                    setSpotifyError(true);
                } finally {
                    setIsLoadingSpotify(false);
                }
            }
        };
        fetchSpotifyAccount();
    }, [userAccount?.hasSpotify, spotifyAccount]);

    async function handleUnlinkSpotify() {
        setIsUnlinking(true);
        try {
            const endpoint = `spotify/unlink`;
            await authorized.get(endpoint);
        } catch {
            // Optionally show error
        } finally {
            setShowUnlinkDialog(false);
            setIsUnlinking(false);
            window.location.reload();
        }
    }

    // Keep selectedTab in sync with tab param
    React.useEffect(() => {
        setSelectedTab(tabIndex);
    }, [tabIndex]);

    return (
        <PageContainer scrollable={false}>

            <div className='flex flex-1 flex-col space-y-4'>
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
                {/* Show mobile navigation menu only on small screens */}
                <MobileNavigationMenu selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                <Separator/>

                <div className="flex flex-1 gap-6 mt-4">
                    {/* Vertical Tabs only on larger screens */}
                    <div className="hidden sm:flex flex-col w-40 border-r pr-4">
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
                    <div className="flex-1">
                        {selectedTab === 0 && (
                            <>
                                {/* Service cards: responsive grid */}
                                <div className="grid gap-4 mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[1fr] grid-flow-row min-w-0 overflow-x-auto">
                                    {serviceIcons.map(service => {
                                        const isConnected = userAccount ? (userAccount as any)[service.key] : false;
                                        // For Spotify, use profileUrl as auth URL for Link button
                                        const isSpotify = service.key === 'hasSpotify';
                                        const spotifyAuthUrl = isSpotify && userAccount && (userAccount as any).profileUrl
                                            ? (userAccount as any).profileUrl
                                            : buildUrl('/link/spotify');
                                        const spotifyProfileUrl = spotifyAccount?.id ? `https://open.spotify.com/user/${spotifyAccount.id}` : undefined;
                                        return (
                                            <Card key={service.key} className={`w-full min-w-[180px] min-h-[180px] h-full min-w-0 p-2 relative ${isSpotify ? 'flex flex-col items-center text-center gap-1' : (isConnected ? 'flex flex-row items-center gap-4' : 'flex flex-col items-center text-center gap-1')}`}>
                                                {(isSpotify && isConnected && (isLoadingSpotify || spotifyError)) ? (
                                                    <div className="flex flex-col items-center w-full p-4">
                                                        <Skeleton className="w-14 h-14 rounded-full mb-2" />
                                                        <Skeleton className="w-24 h-4 mb-1" />
                                                        <Skeleton className="w-16 h-3" />
                                                    </div>
                                                ) : (
                                                <>
                                                {isSpotify && isConnected && (
                                                    <>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => setShowUnlinkDialog(true)}>
                                                                    <IconUnlink size={20} />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="left" align="center">
                                                                Unlink your Spotify account
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <Dialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Unlink Spotify?</DialogTitle>
                                                                    <DialogDescription>
                                                                        Are you sure you want to unlink your Spotify account? This cannot be undone.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="flex gap-4 mt-4">
                                                                    <Button variant="outline" onClick={() => setShowUnlinkDialog(false)} disabled={isUnlinking}>Cancel</Button>
                                                                    <Button variant="destructive" onClick={handleUnlinkSpotify} disabled={isUnlinking}>
                                                                        {isUnlinking ? 'Unlinking...' : 'Unlink'}
                                                                    </Button>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </>
                                                )}
                                                <div className="flex flex-col items-center w-full">
                                                    <div className="flex items-center justify-center h-10 w-10 mx-auto">
                                                        {service.icon}
                                                    </div>
                                                    <CardHeader className="p-0 pb-1 w-full flex flex-col items-center">
                                                        <CardTitle className="text-lg">{service.label}</CardTitle>
                                                        {isConnected && spotifyAccount?.images && spotifyAccount.images[0]?.url ? (
                                                            <img src={spotifyAccount.images[0].url} alt="Spotify profile" className="rounded-full w-14 h-14 object-cover my-2 border" />
                                                        ) : null}
                                                        <CardDescription>
                                                            {isConnected
                                                                ? spotifyAccount?.display_name
                                                                    ? <span>{spotifyAccount.display_name}</span>
                                                                    : 'Connected'
                                                                : 'Not Connected'}
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent className={`p-0 pt-1 break-words w-full ${isSpotify && isConnected ? '' : (isConnected ? 'flex gap-2' : 'flex flex-col items-center w-full')}`}>
                                                        {isSpotify ? (
                                                            isConnected ? (
                                                                spotifyProfileUrl ? (
                                                                    <Button asChild size="sm" variant="secondary" className="w-full">
                                                                        <a href={spotifyProfileUrl} target="_blank" rel="noopener noreferrer">View Profile</a>
                                                                    </Button>
                                                                ) : null
                                                            ) : (
                                                                <Button asChild size="sm" className="w-full">
                                                                    <a href={spotifyAuthUrl}>Link</a>
                                                                </Button>
                                                            )
                                                        ) : (
                                                            isConnected ? (
                                                                <>
                                                                    <Button size="sm" variant="outline">Unlink</Button>
                                                                    <Button size="sm" variant="secondary">View Profile</Button>
                                                                </>
                                                            ) : (
                                                                <Button size="sm" className="w-full">Link</Button>
                                                            )
                                                        )}
                                                    </CardContent>
                                                </div>
                                                </>) /* end else for skeleton */}
                                            </Card>
                                        );
                                    })}
                                </div>
                                {/* Friends/Playlists cards: stack on mobile, row on larger screens */}
                                <div className="flex flex-col gap-4 w-full sm:flex-row">
                                    <Card className="w-full sm:w-1/3 min-w-[180px] flex flex-col">
                                        <CardHeader>
                                            <CardTitle>Friends</CardTitle>
                                            <CardDescription>Your friends on SyncTunez</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Friends list goes here.</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="w-full sm:w-2/3 min-w-[240px] flex flex-col">
                                        <CardHeader>
                                            <CardTitle>Playlists</CardTitle>
                                            <CardDescription>Your playlists</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Playlist content goes here.</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        )}
                        {selectedTab === 1 && (
                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex justify-end mb-2">
                                    <Button size="sm" variant="outline" onClick={() => setCardsSwapped(s => !s)}>Swap Cards</Button>
                                </div>
                                <div className="flex gap-4 w-full">
                                    {cardsSwapped ? (
                                        <>
                                            <Card className="w-1/3 min-w-[180px] flex flex-col">
                                                <CardHeader>
                                                    <CardTitle>Friends</CardTitle>
                                                    <CardDescription>Your friends on SyncTunez</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <p>Friends list goes here.</p>
                                                </CardContent>
                                            </Card>
                                            <Card className="w-2/3 min-w-[240px] flex flex-col">
                                                <CardHeader>
                                                    <CardTitle>Playlists</CardTitle>
                                                    <CardDescription>Your playlists</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <p>Playlist content goes here.</p>
                                                </CardContent>
                                            </Card>
                                        </>
                                    ) : (
                                        <>
                                            <Card className="w-2/3 min-w-[240px] flex flex-col">
                                                <CardHeader>
                                                    <CardTitle>Playlists</CardTitle>
                                                    <CardDescription>Your playlists</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <p>Playlist content goes here.</p>
                                                </CardContent>
                                            </Card>
                                            <Card className="w-1/3 min-w-[180px] flex flex-col">
                                                <CardHeader>
                                                    <CardTitle>Friends</CardTitle>
                                                    <CardDescription>Your friends on SyncTunez</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <p>Friends list goes here.</p>
                                                </CardContent>
                                            </Card>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}