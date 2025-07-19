import React, { useState, useEffect, useReducer } from 'react';
import { useLiveResourceJson } from '@/hooks/useLiveResource';
import { buildUrl } from '@/lib/api/apiClient';
import { MusicPlaylistImportResultSchema } from '@/lib/api/schemas';
import type { MusicPlaylistImportResult } from '@/lib/api/types';
import { parse } from 'path';

export function PlaylistLoader() {
    const [importingPlaylist, setImportingPlaylist] = useState<string | null>(null);
    const [loadedPlaylists, setLoadedPlaylists] = useState(false);

    // Action types for the reducer
    type PlaylistAction  =
    | { type: 'add', playlist: MusicPlaylistImportResult }
    | { type: 'remove', playlistId: number }

    // Reducer to manage the imported playlists
    const playlistReducer = (state: Array<MusicPlaylistImportResult>, action: PlaylistAction) => {
        switch(action.type) {
            case 'add': 
                return [...state, action.playlist];
            case 'remove':
                return state.filter(playlist => playlist.meta.id !== action.playlistId);
            default:
                return state;
        }
    }
    // Reducer to manage the imported playlists
    const [importedPlaylists, dispatch] = useReducer(playlistReducer, []);
 
    // Make a request and listen for updates on mount
    useEffect(() => {
        const {
            data: rawImportPlaylist,
            error: playlistError
        } = useLiveResourceJson<MusicPlaylistImportResult>({
            fetchUrl: buildUrl(`music/playlists`),
            eventName: 'ImportedPlaylists',
            reconnectIntervalMs: 5000,
            shouldProcess: !loadedPlaylists,
            onMessage: (data) => {
                const parsedData = MusicPlaylistImportResultSchema.array().safeParse(data);
                if(parsedData != null && parsedData.success && parsedData.data != null) {
                    parsedData.data.forEach(playlist => {
                        dispatch({type: "add", playlist : playlist})
                    })
                }
            }
        });

        // Only load the playlists once
        setLoadedPlaylists(true);
    }, []);
}