export class MusicTracks {
  constructor({
      title = '',
                artists = [],
                album = '',
                releaseDate = '',
                duration = 0,
                spotifyId = null,
                images = [],
                albumId = null
              } = {}) {
    this.title = title;
    this.artists = artists;
    this.album = album;
    this.releaseDate = releaseDate;
    this.duration = duration;
    this.spotifyId = spotifyId;
    this.images = images;
    this.albumId = albumId;
  }

  static fromRaw(raw) {
    return new MusicTracks({
      title: raw.title || '',
      artists: (raw.artists || []),
      album: raw.album || '',
      releaseDate: raw.releaseDate || '',
      duration: raw.duration || 0,
      spotifyId: raw.spotifyId || null,
      images: raw?.images || [],
      albumId: raw?.albumId || null
    });
  }
}
