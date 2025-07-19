'use client';

import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MergePlaylistList } from "@/components/ui/playlist/merge-playlist-list";
import { TrackTable } from "@/components/ui/playlist/track-table";
import FriendsCard from "@/components/ui/friends-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLiveResourceJson } from "@/hooks/useLiveResource";
import { MusicPlaylistImportResult, MusicPlaylistMeta } from "@/lib/api/types";
import { buildUrl } from "@/lib/api/apiClient";
import { MusicPlaylistImportFriendResult, MusicPlaylistImportFriendResultSchema, MusicPlaylistImportResultSchema } from "@/lib/api/schemas";
import { useServerEvents } from "@/lib/api/ServerEvents";
import FriendSelection from "@/components/ui/friend-selection";

const combinedTracks = [
  { hash: "1", name: "Song 1", album: { name: "Album 1", images: [{ url: "/icon.png" }] }, artists: [{ name: "Artist 1" }], durationMs: 180000 },
  { hash: "2", name: "Song 2", album: { name: "Album 2", images: [{ url: "/icon.png" }] }, artists: [{ name: "Artist 2" }], durationMs: 200000 },
];

export default function MergePlaylistsContent() {
  const [selectedMyPlaylists, setSelectedMyPlaylists] = useState<number[]>([]);
  const [selectedFriendPlaylists, setSelectedFriendPlaylists] = useState<number[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [playlistImage, setPlaylistImage] = useState<string | undefined>(undefined);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [loadedPlaylists, setLoadedPlaylists] = useState(false);
  const [hasStartedLoadingMyPlaylists, setHasStartedLoadingMyPlaylists] = useState(false);
  const titleInputRef = useRef(null);
  const descTextareaRef = useRef(null);
  const [importingPlaylist, setImportingPlaylist] = useState<string | null>(null);
  const [selectedSpotifyPlaylistId, setSelectedSpotifyPlaylistId] = useState<string | undefined>(undefined);

  const [importedPlaylists, setImportedPlaylists] = useState<Array<MusicPlaylistImportResult>>([]);
  const [friendsPlaylists, setFriendsPlaylists] = useState<Array<MusicPlaylistImportResult>>([]);
  const [isLoadingImportedPlaylists, setIsLoadingImportedPlaylists] = useState(true);
  const [isLoadingFriendsPlaylists, setIsLoadingFriendsPlaylists] = useState(true);
  
  const [selectedFriends, setSelectedFriends] = useState<Array<string>>([]);
  const [loadedFriends, setLoadedFriends] = useState<Array<string>>([]);
  const [hasStartedLoadingFriendPlaylists, setHasStartedLoadingFriendPlaylists] = useState(false);



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

  // Import friend playlists
  useEffect(() => {
    let eventSource: EventSource | null = null;
    
    console.log("selectedFriends", selectedFriends);

    const loadPlaylists = async () => {
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
    };
  
    loadPlaylists();
  
    // Cleanup function to close the connection when component unmounts
    return () => { eventSource?.close() };
  }, [selectedFriends]);


  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-[1600px] mx-auto py-4 sm:py-8 px-4 sm:px-0">
      {/* Top row: Options and FriendsCard - Stack vertically on mobile */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full">
        <Card className="w-full lg:flex-1 lg:min-w-[300px] lg:max-w-xl h-auto lg:h-[300px]">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Playlist Options</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start h-full">
              {/* Playlist image area - Center on mobile, left on desktop */}
              <div className="flex justify-center lg:justify-start w-full lg:w-auto">
                <label className="w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 border-2 border-muted-foreground rounded-md flex items-center justify-center bg-muted cursor-pointer hover:opacity-80 transition-opacity relative overflow-hidden group flex-shrink-0">
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
              <div className="flex-1 flex flex-col gap-3 sm:gap-4 w-full h-full">
                {/* Editable Playlist Title */}
                <div className="w-full">
                  {editingTitle ? (
                    <Input
                      ref={titleInputRef}
                      defaultValue={playlistName}
                      onChange={e => setPlaylistName(e.target.value)}
                      onBlur={() => setEditingTitle(false)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') setEditingTitle(false);
                      }}
                      className="h-10 sm:h-12 lg:h-16 text-base sm:text-lg lg:text-xl font-semibold w-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-2"
                      autoFocus
                      placeholder="Enter playlist title"
                    />
                  ) : (
                    <div
                      className="h-10 sm:h-12 lg:h-16 text-base sm:text-lg lg:text-xl font-semibold flex items-center cursor-pointer px-2 rounded-md transition hover:bg-muted w-full min-h-[40px] sm:min-h-[48px] lg:min-h-[64px]"
                      onClick={() => setEditingTitle(true)}
                    >
                      {playlistName || <span className="text-muted-foreground">Click to set playlist title</span>}
                    </div>
                  )}
                </div>
                {/* Editable Playlist Description */}
                <div className="w-full flex-1 min-h-[60px] sm:min-h-[80px] lg:min-h-[120px]">
                  {editingDesc ? (
                    <textarea
                      ref={descTextareaRef}
                      defaultValue={playlistDesc}
                      onChange={e => setPlaylistDesc(e.target.value)}
                      onBlur={() => setEditingDesc(false)}
                      className="h-full text-sm sm:text-base lg:text-xl font-normal w-full rounded-md border border-input bg-background px-3 py-2 resize-none"
                      autoFocus
                      placeholder="Enter playlist description"
                    />
                  ) : (
                    <div
                      className="h-full text-sm sm:text-base lg:text-xl font-normal flex items-start cursor-pointer px-2 py-2 rounded-md transition hover:bg-muted w-full"
                      onClick={() => setEditingDesc(true)}
                    >
                      {playlistDesc || <span className="text-muted-foreground">Click to set playlist description</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Friends and Collaborators - Stack vertically on mobile, side by side on desktop */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full lg:flex-1">
          <div className="flex-1 min-w-[300px] flex items-stretch w-full h-[250px] sm:h-[300px] overflow-hidden">
            <FriendsCard forceFullHeight={false} />
          </div>
          
          <div className="flex-1 min-w-[300px] flex items-stretch w-full max-h-[250px] sm:max-h-[300px] overflow-hidden">
            <FriendSelection
              selectedFriends={selectedFriends}
              onFriendSelectionChange={setSelectedFriends}  
              title="Collaborators"
              emptyMessage="No friends found"
              className="w-full"
              forceFullHeight={false}
            />  
          </div>
        </div>
      </div>
    
      {/* Main content row - Stack vertically on mobile */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-[400px] sm:min-h-[600px]">
        {/* My Playlists */}
        <div className="w-full lg:w-1/3 lg:max-w-[400px] order-1 lg:order-1">
          <MergePlaylistList
            playlists={importedPlaylists.map(playlist => playlist.meta)}
            selectedPlaylistIds={selectedMyPlaylists}
            onPlaylistSelect={(playlistIds) => {
              // If playlistIds is empty, it means "Select All" was unchecked
              if (playlistIds.length === 0) {
                setSelectedMyPlaylists([]);
                return;
              }
              
              // If playlistIds has all playlists, it means "Select All" was checked
              if (playlistIds.length === importedPlaylists.length) {
                setSelectedMyPlaylists(playlistIds);
                return;
              }
              
              // Otherwise, it's an individual playlist toggle
              const clickedId = playlistIds[0];
              setSelectedMyPlaylists(prev => 
                prev.includes(clickedId) 
                  ? prev.filter(id => id !== clickedId)
                  : [...prev, clickedId]
              );
            }}
            loading={isLoadingImportedPlaylists}
            title="My Playlists"
          />
        </div>
        
        {/* Friend Playlists - Show before Combined Tracks on mobile */}
        <div className="w-full lg:w-1/3 lg:max-w-[400px] order-2 lg:order-3">
          <MergePlaylistList
            playlists={friendsPlaylists.map(playlist => playlist.meta)}
            selectedPlaylistIds={selectedFriendPlaylists}
            onPlaylistSelect={(playlistIds) => {
              // If playlistIds is empty, it means "Select All" was unchecked
              if (playlistIds.length === 0) {
                setSelectedFriendPlaylists([]);
                return;
              }
              
              // If playlistIds has all playlists, it means "Select All" was checked
              if (playlistIds.length === friendsPlaylists.length) {
                setSelectedFriendPlaylists(playlistIds);
                return;
              }
              
              // Otherwise, it's an individual playlist toggle
              const clickedId = playlistIds[0];
              setSelectedFriendPlaylists(prev => 
                prev.includes(clickedId) 
                  ? prev.filter(id => id !== clickedId)
                  : [...prev, clickedId]
              );
            }}
            loading={isLoadingFriendsPlaylists}
            title="Friend Playlists"
          />
        </div>
        
        {/* Combined Tracks - Show after Friend Playlists on mobile */}
        <Card className="flex-1 min-w-[300px] w-full lg:w-1/3 order-3 lg:order-2">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Combined Tracks</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TrackTable tracks={combinedTracks} isSpotify={true} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 