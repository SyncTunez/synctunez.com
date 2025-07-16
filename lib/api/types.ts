export interface UserAccountProps {
  username?: string
  profilePicture?: string
  hasSpotify?: boolean
  hasApple?: boolean
  hasYoutube?: boolean
  hasTidal?: boolean
  // Add more optional fields if needed
}

export class UserAccount {
  username: string
  profilePicture: string
  hasSpotify: boolean
  hasApple: boolean
  hasYoutube: boolean
  hasTidal: boolean

  constructor({
    username = '',
    profilePicture = '',
    hasSpotify = false,
    hasApple = false,
    hasYoutube = false,
    hasTidal = false,
  }: UserAccountProps = {}) {
    this.username = username
    this.profilePicture = profilePicture
    this.hasSpotify = hasSpotify
    this.hasApple = hasApple
    this.hasYoutube = hasYoutube
    this.hasTidal = hasTidal
  }
}

// Spotify account API response type
export type SpotifyAccount = {
  id: string;
  displayName?: string;
  images?: { url: string }[];
};

export type SpotifyPlaylist = {
  id: string;
  name?: string;
  description?: string;
  images?: ApiImage[];
  tracks: {
    total: number;
  };
};

export type SpotifyTrack = {
  id: string;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  durationMs: number;
  explicit: boolean;
  name: string;
  track_number: number;
}

export type SpotifyAlbum = {
  id: string;
  total_tracks: number;
  images: ApiImage[];
  name: string;
  release_date: string; // releaseDate in Kotlin
  artists: SpotifyArtist[];
}

export type SpotifyArtist = {
  id: string;
  name: string;
}

export type ApiImage = {
  url?: string;
  height?: number;
  width?: number;
};

export type MusicPlaylistImportResult = {
  status: string;
  meta: MusicPlaylistMeta;
  tracks: MusicTrack[];
}

export type MusicTrack = {
  title: string;
  artists: string[];
  album: string;
  releaseDate: string;
  duration: number;
  spotifyId?: string | null;
  youtubeId?: string | null;
  unavailableOn?: string[];
  images?: ApiImage[];
  albumId?: string | null;
};

export type MusicPlaylistMeta = {
  id: number;
  title: string;
  trackNumber: number;
  image?: ApiImage | null;
  owner: string;
  collaborators: string[];
  createdAt?: number;
  from: string;
  inSync?: boolean;
};