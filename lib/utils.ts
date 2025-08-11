import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MusicTrack } from '@/lib/api/schemas';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocalApiUrl(): string {
  // Check for environment variable first - use NEXT_PUBLIC_ for client-side access
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (apiUrl) {
    return apiUrl;
  }
  
  // Fallback to localhost:8080 for development
  return 'http://localhost:8080';
}

export function storeHomeUrl(): void {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  // Only store if we're on Vercel (production)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    const homeUrl = `${window.location.protocol}//${window.location.host}`;
    document.cookie = `synctunez_home_url=${encodeURIComponent(homeUrl)}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
  }
}

export function getHomeUrl(): string | null {
  // Only run on client side
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'synctunez_home_url') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// Track helpers
function normalizeString(value: string | undefined | null): string {
  return (value ?? '').trim().toLowerCase();
}

/**
 * Builds a stable key for a track prioritizing service IDs.
 * - Prefer Spotify ID, then YouTube ID
 * - Fallback to normalized title + artists
 */
export function buildStableTrackKey(track: MusicTrack): string {
  const spotifyId = track.spotifyId ?? undefined;
  const youtubeId = track.youtubeId ?? undefined;
  if (spotifyId && spotifyId.length > 0) return `sp:${spotifyId}`;
  if (youtubeId && youtubeId.length > 0) return `yt:${youtubeId}`;
  const title = normalizeString(track.title);
  const artists = (track.artists ?? []).map(normalizeString).join(',');
  return `meta:${title}|${artists}`;
}

/**
 * Dedupe a list of tracks using stable keys while preserving order.
 */
export function dedupeTracks(tracks: MusicTrack[]): MusicTrack[] {
  const seen = new Set<string>();
  const result: MusicTrack[] = [];
  for (const track of tracks) {
    const key = buildStableTrackKey(track);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(track);
  }
  return result;
}

/**
 * Merge incoming tracks into an existing list with de-duplication.
 * Keeps the original order for existing items, appends only new unique items.
 */
export function mergeAndDedupeTracks(existing: MusicTrack[], incoming: MusicTrack[]): MusicTrack[] {
  if (!Array.isArray(existing) || existing.length === 0) return dedupeTracks(incoming);
  if (!Array.isArray(incoming) || incoming.length === 0) return existing.slice();

  const map = new Map<string, MusicTrack>();
  for (const t of existing) {
    map.set(buildStableTrackKey(t), t);
  }
  for (const t of incoming) {
    const key = buildStableTrackKey(t);
    if (!map.has(key)) {
      map.set(key, t);
    }
  }

  return Array.from(map.values());
}
