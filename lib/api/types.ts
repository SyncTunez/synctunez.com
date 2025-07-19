// Re-export types from schemas for backward compatibility
export type {
  UserAccountProps,
  SpotifyAccount,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyAlbum,
  SpotifyArtist,
  ApiImage,
  MusicPlaylistImportResult,
  MusicPlaylistImportFriendResult,
  MusicTrack,
  MusicPlaylistMeta,
  Friend,
} from './schemas';

// Import UserAccountProps type for the class
import type { UserAccountProps } from './schemas';

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