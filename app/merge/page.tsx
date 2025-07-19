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
import { MusicPlaylistImportResultSchema } from "@/lib/api/schemas";
import { useServerEvents } from "@/lib/api/ServerEvents";

// Placeholder data
const myPlaylists = [
  { id: 1, title: "My Playlist 1", image: { url: "/icon.png" }, from: "spotify" },
  { id: 2, title: "My Playlist 2", image: { url: "/icon.png" }, from: "spotify" },
];
const friendsPlaylists = [
  { id: 3, title: "Friend's Playlist 1", image: { url: "/icon.png" }, from: "spotify" },
  { id: 4, title: "Friend's Playlist 2", image: { url: "/icon.png" }, from: "spotify" },
];
const combinedTracks = [
  { hash: "1", name: "Song 1", album: { name: "Album 1", images: [{ url: "/icon.png" }] }, artists: [{ name: "Artist 1" }], durationMs: 180000 },
  { hash: "2", name: "Song 2", album: { name: "Album 2", images: [{ url: "/icon.png" }] }, artists: [{ name: "Artist 2" }], durationMs: 200000 },
];


export default function MergePlaylistsPage() {
  const [selectedMyPlaylist, setSelectedMyPlaylist] = useState<number | undefined>(undefined);
  const [selectedFriendPlaylist, setSelectedFriendPlaylist] = useState<number | undefined>(undefined);
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
  
  const [selectedFriends, setSelectedFriends] = useState<Array<string>>(["jackery"]);
  const [loadedFriends, setLoadedFriends] = useState<Array<string>>([]);
  const [hasStartedLoadingFriendPlaylists, setHasStartedLoadingFriendPlaylists] = useState(false);

  // Extract MusicPlaylistMeta from imported playlists
  const playlistMetas: MusicPlaylistMeta[] = importedPlaylists.map(playlist => playlist.meta);
  

  useEffect(() => {
    console.log("Loading playlists");
    let eventSource: EventSource | null = null;
    
    const loadPlaylists = async () => {
      try {
        eventSource = await useServerEvents<Array<MusicPlaylistImportResult>>(
          buildUrl(`music/playlists`), 
          'ImportedPlaylists', 
          MusicPlaylistImportResultSchema.array(), 
          (data) => {
            console.log("Received playlist data:", data);
            setImportedPlaylists(data);
          }
        );
      } catch (error) {
        console.error("Failed to connect to SSE:", error);
      }
    };
  
    loadPlaylists();
  
    // Cleanup function to close the connection when component unmounts
    return () => { eventSource?.close() };
  }, []);



  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto py-8">
      {/* Top row: Options and FriendsCard */}
      <div className="flex flex-row gap-6 w-full">
        <Card className="flex-1 min-w-[300px] max-w-xl">
          <CardHeader>
            <CardTitle>Playlist Options</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="flex flex-row gap-6 items-start h-full">
              {/* Left: Playlist image area (clickable for upload) */}
              <label className="w-48 h-48 border-2 border-muted-foreground rounded-md flex items-center justify-center bg-muted cursor-pointer hover:opacity-80 transition-opacity relative overflow-hidden group flex-shrink-0">
                {playlistImage ? (
                  <img src={playlistImage} alt="Playlist" className="w-full h-full object-cover rounded-md" />
                ) : (
                  <span className="text-muted-foreground">Click to upload image</span>
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
              {/* Right: Fields */}
              <div className="flex-1 flex flex-col gap-4 w-full h-full">
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
                      className="h-16 text-xl font-semibold w-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-2"
                      autoFocus
                      placeholder="Enter playlist title"
                    />
                  ) : (
                    <div
                      className="h-16 text-xl font-semibold flex items-center cursor-pointer px-2 rounded-md transition hover:bg-muted w-full"
                      onClick={() => setEditingTitle(true)}
                    >
                      {playlistName || <span className="text-muted-foreground">Click to set playlist title</span>}
                    </div>
                  )}
                </div>
                {/* Editable Playlist Description */}
                <div className="w-full flex-1">
                  {editingDesc ? (
                    <textarea
                      ref={descTextareaRef}
                      defaultValue={playlistDesc}
                      onChange={e => setPlaylistDesc(e.target.value)}
                      onBlur={() => setEditingDesc(false)}
                      className="h-full text-xl font-normal w-full rounded-md border border-input bg-background px-3 py-2 resize-none"
                      autoFocus
                      placeholder="Enter playlist description"
                    />
                  ) : (
                    <div
                      className="h-full text-xl font-normal flex items-center cursor-pointer px-2 rounded-md transition hover:bg-muted w-full"
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
        <div className="flex-1 min-w-[300px] flex items-stretch w-full">
          <FriendsCard forceFullHeight={false} />
        </div>
        <Card className="flex-1 min-w-[300px] max-w-xl">
          <CardHeader>
            <CardTitle>Collaborators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">Collaborators content goes here.</div>
          </CardContent>
        </Card>
      </div>
      {/* Main content row */}
      <div className="flex flex-1 flex-row gap-6 min-h-[600px]">
        {/* Left: My Playlists */}
        <div className="flex-1 min-w-[260px] max-w-xs flex flex-col">
          <MergePlaylistList
            playlists={playlistMetas}
            selectedPlaylistId={selectedMyPlaylist}
            onPlaylistSelect={setSelectedMyPlaylist}
            title="My Playlists"
            emptyMessage="No playlists imported yet"
          />
        </div>
        {/* Center: Playlist Preview */}
        <div className="flex-[2] min-w-[400px] flex flex-col gap-4 items-center">
          <Card className="w-full flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Playlist Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <TrackTable tracks={combinedTracks} isSpotify={true} />
            </CardContent>
          </Card>
          <div className="flex justify-center w-full">
            <Button size="lg" className="w-1/2">Export to Spotify</Button>
          </div>
        </div>
        {/* Right: Friend's Playlists */}
        <div className="flex-1 min-w-[260px] max-w-xs flex flex-col">
          <MergePlaylistList
            playlists={friendsPlaylists.map(playlist => playlist.meta)}
            selectedPlaylistId={selectedFriendPlaylist}
            onPlaylistSelect={setSelectedFriendPlaylist}
            title="Friend's Playlists"
            emptyMessage="No friend playlists available"
          />
        </div>
      </div>
    </div>
  );
} 