'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MergePlaylistList } from "@/components/ui/playlist/merge-playlist-list";
import { TrackTable, TrackTableSkeleton } from "@/components/ui/playlist/track-table";
import FriendsCard from "@/components/ui/friends-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLiveResourceJson } from "@/hooks/useLiveResource";
import { MusicPlaylistImportResult, MusicPlaylistMeta } from "@/lib/api/types";
import { buildUrl } from "@/lib/api/apiClient";
import { MusicPlaylistImportFriendResult, MusicPlaylistImportFriendResultSchema, MusicPlaylistImportResultSchema, MusicPlaylistMetaSchema, MusicTrack, MusicTrackSchema, SpotifyPlaylist, SpotifyPlaylistSchema, Friend } from "@/lib/api/schemas";
import { useServerEvents } from "@/lib/api/ServerEvents";
import FriendSelection from "@/components/ui/friend-selection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconFilter } from "@tabler/icons-react";
import { IconBrandSpotify } from "@tabler/icons-react";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import md5 from 'blueimp-md5';

const combinedTracks = [
  { hash: "1", name: "Song 1", album: { name: "Album 1", images: [{ url: "/icon.png" }] }, artists: [{ name: "Artist 1" }], durationMs: 180000 },
  { hash: "2", name: "Song 2", album: { name: "Album 2", images: [{ url: "/icon.png" }] }, artists: [{ name: "Artist 2" }], durationMs: 200000 },
];

export default function MergePlaylistsContent() {
  const router = useRouter();
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [playlistImage, setPlaylistImage] = useState<string | undefined>(undefined);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [loadedPlaylists, setLoadedPlaylists] = useState(false);
  const [hasStartedLoadingMyPlaylists, setHasStartedLoadingMyPlaylists] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const descTextareaRef = useRef<HTMLInputElement | null>(null);
  const [importingPlaylist, setImportingPlaylist] = useState<string | null>(null);
  const [selectedSpotifyPlaylistId, setSelectedSpotifyPlaylistId] = useState<string | undefined>(undefined);

  const [importedPlaylists, setImportedPlaylists] = useState<Array<MusicPlaylistImportResult>>([]);
  const [friendsPlaylists, setFriendsPlaylists] = useState<Array<MusicPlaylistImportResult>>([]);
  const [friendsList, setFriendsList] = useState<Array<Friend>>([]);
  const [isLoadingImportedPlaylists, setIsLoadingImportedPlaylists] = useState(true);
  const [isLoadingFriendsPlaylists, setIsLoadingFriendsPlaylists] = useState(true);
  
  const [selectedFriends, setSelectedFriends] = useState<Array<string>>([]);
  const [loadedFriends, setLoadedFriends] = useState<Array<string>>([]);
  const [hasStartedLoadingFriendPlaylists, setHasStartedLoadingFriendPlaylists] = useState(false);
  const [filteredFriend, setFilteredFriend] = useState<string | null>(null);

  const [combinedTracks, setCombinedTracks] = useState<Array<MusicTrack>>([]);
  const [isLoadingCombinedTracks, setIsLoadingCombinedTracks] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [excludedArtists, setExcludedArtists] = useState<Array<string>>([]);
  const [removedTrackKeys, setRemovedTrackKeys] = useState<Set<string>>(new Set());
  const filterBadgeClass = "inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full border border-destructive/80 bg-destructive/70 text-white hover:bg-destructive/80 focus-visible:outline-none";
  const [visibleCount, setVisibleCount] = useState<number>(50);

  // Memoized derived data to keep props stable across unrelated re-renders
  const myPlaylistsMeta = useMemo(
    () => importedPlaylists.map((playlist) => playlist.meta),
    [importedPlaylists]
  );

  const friendsPlaylistsMetaFiltered = useMemo(() => {
    const metas = friendsPlaylists.map((playlist) => playlist.meta);
    if (!filteredFriend) return metas;
    return metas.filter((playlist) => playlist.owner === filteredFriend);
  }, [friendsPlaylists, filteredFriend]);

  const filteredTracks = useMemo(() => {
    if (!combinedTracks.length) return [] as Array<MusicTrack>;
    const tracks = combinedTracks.filter((t) => {
      const artistMatch = (t.artists || []).every(a => !excludedArtists.includes(a));
      return artistMatch;
    });
    return tracks;
  }, [combinedTracks, excludedArtists]);

  const filteredAndTrimmedTracks = useMemo(() => {
    const result: Array<MusicTrack> = [];
    for (const t of filteredTracks) {
      const key = `${t.spotifyId || 'no-spotify'}|${t.youtubeId || 'no-youtube'}|${t.title}|${(t.artists || []).join(',')}`;
      if (!removedTrackKeys.has(key)) {
        result.push(t);
      }
      if (result.length >= visibleCount) break;
    }
    return result;
  }, [filteredTracks, removedTrackKeys, visibleCount]);

  // Count of tracks remaining after filters and removals (ignores visibleCount)
  const filteredRemainingCount = useMemo(() => {
    let count = 0;
    for (const t of filteredTracks) {
      const key = `${t.spotifyId || 'no-spotify'}|${t.youtubeId || 'no-youtube'}|${t.title}|${(t.artists || []).join(',')}`;
      if (!removedTrackKeys.has(key)) count++;
    }
    return count;
  }, [filteredTracks, removedTrackKeys]);

  // Reset or clamp visible count when filters or data change
  useEffect(() => {
    setVisibleCount((prev) => Math.min(Math.max(50, prev), filteredTracks.length));
  }, [filteredTracks.length]);
  useEffect(() => {
    // when clearing removed or artists change, ensure at least baseline
    setVisibleCount((prev) => Math.max(50, prev));
  }, [excludedArtists, removedTrackKeys.size]);

  const handleSavePlaylist = async () => {
    // Ensure latest edits are captured even if input hasn't blurred
    const effectiveTitle = editingTitle && titleInputRef.current
      ? titleInputRef.current.value
      : playlistName;
    const effectiveDesc = editingDesc && descTextareaRef.current
      ? descTextareaRef.current.value
      : playlistDesc;

    // Validate required fields
    if (!effectiveTitle.trim()) {
      toast.error('Please enter a playlist title');
      return;
    }

    if (selectedMyPlaylists.length === 0 && selectedFriendPlaylists.length === 0) {
      toast.error('Please select at least one playlist');
      return;
    }

    try {
      setIsCreating(true);
      // Build list of removed tracks as md5(title|artist|album)
      const removedHashes: string[] = [];
      for (const t of combinedTracks) {
        const key = `${t.spotifyId || 'no-spotify'}|${t.youtubeId || 'no-youtube'}|${t.title}|${(t.artists || []).join(',')}`;
        if (removedTrackKeys.has(key)) {
          const base = `${t.title}|${(t.artists || [""])[0]}|${t.album}`;
          removedHashes.push(md5(base));
        }
      }

      const removedArtistHashes = Array.from(new Set(excludedArtists)).map((name) => md5(name));

      const queryParams = {
        friends: selectedFriendPlaylists.join(','),
        mine: selectedMyPlaylists.join(','),
        title: effectiveTitle,
        description: effectiveDesc,
        collaborators: selectedFriends.join(','),
        removedTracks: removedHashes.join(','),
        removedArtists: removedArtistHashes.join(',')
      };
      const url = buildUrl('spotify/playlists/create', queryParams);

      // Start SSE to listen for creation completion
      let eventSource: EventSource | null = null;
      eventSource = await useServerEvents<MusicPlaylistMeta>(
        url,
        'SpotifyPlaylistCreate',
        MusicPlaylistMetaSchema,
        (created) => {
          console.log("Playlist created", created);
          eventSource?.close();
          if (created?.id != null) {
            router.push(`/playlist?id=${created.id}&created=true`);
          }
        }
      );
    } catch (error) {
      console.error('Error creating playlist:', error);
      setIsCreating(false);
      toast.error('Error creating playlist. Please try again.');
    }
  };

  // Selected Playlists and debounced versions to prevent too many re-renders
  const [selectedMyPlaylists, setSelectedMyPlaylists] = useState<number[]>([]);
  const [selectedFriendPlaylists, setSelectedFriendPlaylists] = useState<number[]>([]);
  
  // Debounced versions for API calls
  const [debouncedSelectedMyPlaylists, setDebouncedSelectedMyPlaylists] = useState<number[]>([]);
  const [debouncedSelectedFriendPlaylists, setDebouncedSelectedFriendPlaylists] = useState<number[]>([]);

  // Debounce selectedMyPlaylists
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSelectedMyPlaylists(selectedMyPlaylists);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedMyPlaylists]);

  // Debounce selectedFriendPlaylists
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSelectedFriendPlaylists(selectedFriendPlaylists);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedFriendPlaylists]);

  // Load my playlists
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
            setImportedPlaylists(data);
            setIsLoadingImportedPlaylists(false);
          }
        );
      } catch (error) {
        console.error("Failed to connect to SSE:", error);
        setIsLoadingImportedPlaylists(false);
      }
    };
  
    loadPlaylists();
  
    // Cleanup function to close the connection when component unmounts
    return () => { eventSource?.close() };
  }, []);


  // Load friends playlists when selectedFriends changes
  useEffect(() => {
    let eventSource: EventSource | null = null;
    
    const loadPlaylists = async () => {
      if (selectedFriends.length === 0) {
        setFriendsPlaylists([]);
        setIsLoadingFriendsPlaylists(false);
        return;
      }
      console.log("Loading friends playlists", selectedFriends);
      setIsLoadingFriendsPlaylists(true);
      eventSource = await useServerEvents<Array<MusicPlaylistImportFriendResult>>(
        buildUrl(`music/playlists/friends?q=${selectedFriends.join(',')}`), 
        'ImportedPlaylistFriend', 
        MusicPlaylistImportFriendResultSchema.array(), 
        (data) => {
          console.log("data", data);
          setFriendsPlaylists(data);
          setIsLoadingFriendsPlaylists(false);
        }
      );

      console.log("eventSource", eventSource);
    };
  
    loadPlaylists();
  
    // Cleanup function to close the connection when component unmounts
    return () => { eventSource?.close() };
  }, [selectedFriends]);

  // Load combined tracks when selectedMyPlaylists or selectedFriendPlaylists changes
  useEffect(() => {
    let eventSource: EventSource | null = null;
    
    // Only load tracks if there are selected playlists from both sides
    const hasSelectedMyPlaylists = debouncedSelectedMyPlaylists.length > 0;
    const hasSelectedFriendPlaylists = debouncedSelectedFriendPlaylists.length > 0;
    const hasSelectedPlaylistsFromBothSides = hasSelectedMyPlaylists && hasSelectedFriendPlaylists;
    
    if (!hasSelectedPlaylistsFromBothSides) {
      setCombinedTracks([]);
      setIsLoadingCombinedTracks(false);
      return;
    }
    
    const loadPlaylists = async () => {
      console.log("Loading combined tracks ", [...debouncedSelectedMyPlaylists, ...debouncedSelectedFriendPlaylists].join(','));
      setIsLoadingCombinedTracks(true);
      eventSource = await useServerEvents<Array<MusicTrack>>(
        buildUrl(`music/playlists/merge?mine=${debouncedSelectedMyPlaylists.join(',')}&friends=${debouncedSelectedFriendPlaylists.join(',')}`), 
        'ImportedPlaylistTracks', 
        MusicTrackSchema.array(), 
        (data) => {
          console.log("data", data);
          setCombinedTracks(data);
          setIsLoadingCombinedTracks(false);
        }
      );
    };
  
    loadPlaylists();
    return () => { eventSource?.close() };
  }, [debouncedSelectedMyPlaylists, debouncedSelectedFriendPlaylists]);


  return (
      <div className={`flex flex-col gap-4 sm:gap-6 w-full max-w-[1600px] mx-auto py-4 sm:py-8 px-4 sm:px-0 ${isCreating ? 'opacity-80 pointer-events-none' : ''}`}>
      {/* Top row: Options and FriendsCard - Stack vertically on mobile */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full">
        <Card className="w-full lg:flex-1 lg:min-w-[300px] lg:max-w-xl h-auto lg:h-[300px]">
          <CardHeader className="pb-1 sm:pb-2 pt-3 sm:pt-4">
            <CardTitle className="text-lg sm:text-xl">Playlist Options</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start h-full">
              {/* Playlist image area - Center on mobile, left on desktop */}
              <div className="flex justify-center lg:justify-start w-full lg:w-auto">
                <label className="w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 border-2 border-muted-foreground rounded-md flex items-center justify-center bg-muted cursor-pointer hover:opacity-80 transition-opacity relative overflow-hidden group flex-shrink-0">
                  {playlistImage ? (
                    <img src={playlistImage} alt="Playlist" className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <span className="text-muted-foreground text-xs sm:text-sm lg:text-base text-center px-1 sm:px-2">Click to upload image</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) setPlaylistImage(URL.createObjectURL(file));
                    }}
                    tabIndex={-1}
                  />
                </label>
              </div>
              {/* Fields - Full width on mobile */}
              <div className="flex-1 flex flex-col gap-2 sm:gap-3 w-full h-full">
                {/* Editable Playlist Title */}
                <div className="w-full">
                  {editingTitle ? (
                    <Input
                      ref={titleInputRef}
                      defaultValue={playlistName}
                      onBlur={(e) => {
                        setPlaylistName(e.currentTarget.value);
                        setEditingTitle(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setPlaylistName((e.currentTarget as HTMLInputElement).value);
                          setEditingTitle(false);
                        } else if (e.key === 'Tab' && !e.shiftKey) {
                          e.preventDefault();
                          setPlaylistName((e.currentTarget as HTMLInputElement).value);
                          setEditingTitle(false);
                          setEditingDesc(true);
                        }
                      }}
                      className="h-8 sm:h-10 lg:h-12 text-base sm:text-lg lg:text-xl font-semibold w-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-2"
                      autoFocus
                      placeholder="Enter playlist title"
                    />
                  ) : (
                    <div
                      className="h-8 sm:h-10 lg:h-12 text-base sm:text-lg lg:text-xl font-semibold flex items-center cursor-pointer px-2 rounded-md transition hover:bg-muted w-full min-h-[32px] sm:min-h-[40px] lg:min-h-[48px]"
                      onClick={() => setEditingTitle(true)}
                    >
                      {playlistName || <span className="text-muted-foreground">Click to set playlist title</span>}
                    </div>
                  )}
                </div>
                {/* Editable Playlist Description */}
                <div className="w-full h-[32px]">
                  {editingDesc ? (
                    <Input
                      ref={descTextareaRef}
                      defaultValue={playlistDesc}
                      onBlur={(e) => {
                        setPlaylistDesc(e.currentTarget.value);
                        setEditingDesc(false);
                      }}
                      className="h-full text-sm font-normal w-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-2"
                      autoFocus
                      placeholder="Enter playlist description"
                    />
                  ) : (
                    <div
                      className="h-full text-sm font-normal flex items-center cursor-pointer px-2 rounded-md transition hover:bg-muted w-full"
                      onClick={() => setEditingDesc(true)}
                    >
                      {playlistDesc || <span className="text-muted-foreground">Click to set playlist description</span>}
                    </div>
                  )}
                </div>
                {/* Save Playlist Button */}
                <div className="pt-1">
                  <Button 
                    className="w-[60%] bg-teal-600 hover:bg-teal-700 hover:text-white text-white border-0" 
                    size="sm"
                    disabled={filteredRemainingCount === 0 || isCreating}
                    onClick={handleSavePlaylist}
                  >
                    {isCreating ? 'Creating…' : 'Save Playlist'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Friends and Collaborators - Stack vertically on mobile, side by side on desktop */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full lg:flex-1">
          <div className="flex-1 min-w-[300px] flex items-stretch w-full h-[250px] sm:h-[300px] overflow-hidden">
            <FriendsCard forceFullHeight={false} onFriendsChange={setFriendsList} />
          </div>
          
          <div className="flex-1 min-w-[300px] flex items-stretch w-full max-h-[250px] sm:max-h-[300px] overflow-hidden">
            <FriendSelection
              selectedFriends={selectedFriends}
              onFriendSelectionChange={setSelectedFriends}  
              title="Collaborators"
              emptyMessage="No friends found"
              className="w-full"
              forceFullHeight={false}
              friends={friendsList}
            />  
          </div>
        </div>
      </div>
    
      {/* Main content row - Stack vertically on mobile */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-[400px] sm:min-h-[600px]">
        {/* My Playlists */}
        <div className="w-full lg:w-1/3 lg:max-w-[400px] order-1 lg:order-1 h-[400px] sm:h-[600px]">
          {useMemo(() => {
            const handleSelectMyPlaylists = (playlistIds: number[]) => {
              if (playlistIds.length === 0) {
                setSelectedMyPlaylists([]);
                return;
              }
              // If multiple ids are provided (e.g., select all), set exactly to that list
              if (playlistIds.length > 1) {
                setSelectedMyPlaylists(playlistIds);
                return;
              }
              // Toggle single clicked id
              const clickedId = playlistIds[0];
              setSelectedMyPlaylists((prev) =>
                prev.includes(clickedId)
                  ? prev.filter((id) => id !== clickedId)
                  : [...prev, clickedId]
              );
            };
            return (
              <MergePlaylistList
                playlists={myPlaylistsMeta}
                selectedPlaylistIds={selectedMyPlaylists}
                onPlaylistSelect={handleSelectMyPlaylists}
                loading={isLoadingImportedPlaylists}
                title="My Playlists"
              />
            );
          }, [myPlaylistsMeta, selectedMyPlaylists, isLoadingImportedPlaylists, importedPlaylists.length])}
        </div>
        
        {/* Friend Playlists - Show before Combined Tracks on mobile */}
        <div className="w-full lg:w-1/3 lg:max-w-[400px] order-2 lg:order-3 h-[400px] sm:h-[600px]">
          {useMemo(() => {
            const handleSelectFriendPlaylists = (playlistIds: number[]) => {
              if (playlistIds.length === 0) {
                setSelectedFriendPlaylists([]);
                return;
              }
              // If multiple ids are provided (e.g., select all in current view), set exactly to that list
              if (playlistIds.length > 1) {
                setSelectedFriendPlaylists(playlistIds);
                return;
              }
              // Toggle single clicked id
              const clickedId = playlistIds[0];
              setSelectedFriendPlaylists((prev) =>
                prev.includes(clickedId)
                  ? prev.filter((id) => id !== clickedId)
                  : [...prev, clickedId]
              );
            };
            const filterButton =
              selectedFriends.length > 0 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-6 px-2">
                      <IconFilter className="w-3 h-3 mr-1" />
                      {filteredFriend ? filteredFriend : selectedFriends.length}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1 text-xs text-muted-foreground">
                      {filteredFriend ? 'Filtered by:' : 'Filter by friend:'}
                    </div>
                    {filteredFriend && (
                      <DropdownMenuItem
                        onClick={() => setFilteredFriend(null)}
                        className="text-xs text-blue-600"
                      >
                        Show All Friends
                      </DropdownMenuItem>
                    )}
                    {selectedFriends.map((friend) => (
                      <DropdownMenuItem
                        key={friend}
                        className={`text-xs ${filteredFriend === friend ? 'bg-muted' : ''}`}
                        onClick={() => setFilteredFriend(filteredFriend === friend ? null : friend)}
                      >
                        {friend}
                        {filteredFriend === friend && ' ✓'}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null;

            return (
              <MergePlaylistList
                playlists={friendsPlaylistsMetaFiltered}
                selectedPlaylistIds={selectedFriendPlaylists}
                onPlaylistSelect={handleSelectFriendPlaylists}
                loading={isLoadingFriendsPlaylists && selectedFriends.length > 0}
                title="Friend Playlists"
                emptyMessage={
                  selectedFriends.length === 0
                    ? 'Select a friend to collaborate with'
                    : 'No playlists found'
                }
                filterButton={filterButton}
              />
            );
          }, [
            friendsPlaylistsMetaFiltered,
            selectedFriendPlaylists,
            isLoadingFriendsPlaylists,
            selectedFriends,
            filteredFriend,
            friendsPlaylists.length,
          ])}
        </div>
        
        {/* Combined Tracks - Show after Friend Playlists on mobile */}
         <Card className="flex-1 min-w-[300px] w-full lg:w-1/3 order-3 lg:order-2 overflow-hidden h-[400px] sm:h-[600px]">
          <CardHeader>
            <div className="flex flex-col gap-3">
              <CardTitle className="text-lg sm:text-xl">Combined Tracks</CardTitle>
              {(excludedArtists.length > 0 || removedTrackKeys.size > 0) && (
                <div className="flex flex-wrap items-center gap-2">
                  {removedTrackKeys.size > 0 && (
                    <button
                      type="button"
                      className={filterBadgeClass}
                      aria-label="Restore removed tracks"
                      title="Restore removed tracks"
                      onClick={() => setRemovedTrackKeys(new Set())}
                    >
                      <span className="truncate max-w-[16ch]">{removedTrackKeys.size} {removedTrackKeys.size === 1 ? 'track' : 'tracks'}</span>
                      <span aria-hidden="true" className="text-white/80">×</span>
                    </button>
                  )}
                  {excludedArtists.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={filterBadgeClass}
                      aria-label={`Remove ${name} from excluded artists`}
                      title="Remove filter"
                      onClick={() => setExcludedArtists(prev => prev.filter(n => n !== name))}
                    >
                      <span className="truncate max-w-[16ch]">{name}</span>
                      <span aria-hidden="true" className="text-white/80">×</span>
                    </button>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => setExcludedArtists([])} aria-label="Clear filters">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 -ml-4">
            {useMemo(() => {
              if (isLoadingCombinedTracks) return <TrackTableSkeleton />;
              return (
                <TrackTable
                  tracks={filteredAndTrimmedTracks}
                  isSpotify={true}
                  showTrackCount={true}
                  totalTracks={filteredTracks.length}
                  onRemoveTrack={(track, key) => {
                    setRemovedTrackKeys(prev => new Set(prev).add(key));
                  }}
                  scrollClassName="h-[320px] sm:h-[380px] md:h-[420px] overflow-y-auto overflow-x-hidden pr-2"
                  onBlockArtist={(name) => {
                    if (!name) return;
                    setExcludedArtists(prev => Array.from(new Set([...prev, name])));
                  }}
                  onReachEnd={() => {
                    // reveal more tracks in increments
                    setVisibleCount((prev) => Math.min(prev + 50, filteredTracks.length));
                  }}
                  emptyLabel={
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">No tracks found.</p>
                      <p className="text-sm text-muted-foreground">Select playlists from you and your friends, then filter or remove tracks to curate your final list.</p>
                    </div>
                  }
                />
              );
            }, [isLoadingCombinedTracks, filteredAndTrimmedTracks, filteredTracks.length])}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 