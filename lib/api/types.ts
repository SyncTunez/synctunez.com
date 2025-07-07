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
  display_name?: string;
  images?: { url: string }[];
}; 