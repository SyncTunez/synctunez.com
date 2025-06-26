
export class UserAccount {
  constructor({
     username = '',
     profilePicture = '',
     hasSpotify = false,
     hasApple = false,
     hasYoutube = false,
     hasTidal = false,
    // Add more fields with safe defaults
  } = {}) {
    this.username = username
    this.profilePicture = profilePicture
    this.hasSpotify = hasSpotify
    this.hasApple = hasApple
    this.hasYoutube = hasYoutube
    this.hasTidal = hasTidal
  }
}
