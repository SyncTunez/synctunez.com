import { z } from 'zod';

// Base schemas
export const ApiImageSchema = z.object({
  url: z.string().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
});

export const SpotifyArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const SpotifyAlbumSchema = z.object({
  id: z.string(),
  total_tracks: z.number(),
  images: z.array(ApiImageSchema),
  name: z.string(),
  release_date: z.string(),
  artists: z.array(SpotifyArtistSchema),
});

export const SpotifyTrackSchema = z.object({
  id: z.string(),
  album: SpotifyAlbumSchema,
  artists: z.array(SpotifyArtistSchema),
  durationMs: z.number(),
  explicit: z.boolean(),
  name: z.string(),
  track_number: z.number(),
});

export const SpotifyPlaylistSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  images: z.array(ApiImageSchema).optional(),
  tracks: z.object({
    total: z.number(),
  }),
});

export const SpotifyAccountSchema = z.object({
  id: z.string(),
  displayName: z.string().optional(),
  images: z.array(z.object({ url: z.string() })).optional(),
});

// Music schemas
export const MusicTrackSchema = z.object({
  title: z.string(),
  artists: z.array(z.string()),
  album: z.string(),
  releaseDate: z.string(),
  duration: z.number(),
  spotifyId: z.string().nullable().optional(),
  youtubeId: z.string().nullable().optional(),
  unavailableOn: z.array(z.string()).optional(),
  images: z.array(ApiImageSchema).optional(),
  albumId: z.string().nullable().optional(),
});

export const MusicPlaylistMetaSchema = z.object({
  id: z.number(),
  title: z.string(),
  trackNumber: z.number(),
  image: ApiImageSchema.nullable().optional(),
  owner: z.string(),
  collaborators: z.array(z.string()),
  createdAt: z.number().optional(),
  from: z.string(),
  inSync: z.boolean().optional(),
});

  export const MusicPlaylistImportResultSchema = z.object({
    status: z.string(),
    meta: MusicPlaylistMetaSchema,
    tracks: z.array(MusicTrackSchema),
  });

export const MusicPlaylistImportFriendResultSchema = z.object({
  status: z.string(),
  friend: z.string(),
  meta: MusicPlaylistMetaSchema,
  tracks: z.array(MusicTrackSchema),
});

// User account schemas
export const UserAccountPropsSchema = z.object({
  username: z.string().optional(),
  profilePicture: z.string().optional(),
  hasSpotify: z.boolean().optional(),
  hasApple: z.boolean().optional(),
  hasYoutube: z.boolean().optional(),
  hasTidal: z.boolean().optional(),
});

export const UserAccountSchema = z.object({
  username: z.string(),
  profilePicture: z.string(),
  hasSpotify: z.boolean(),
  hasApple: z.boolean(),
  hasYoutube: z.boolean(),
  hasTidal: z.boolean(),
});

// Form schemas
export const RegisterFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export const AddFriendFormSchema = z.object({
  username: z.string().min(1, "Username is required").max(50),
});

// API response schemas
export const FriendApiResponseSchema = z.object({
  username: z.string(),
  addTime: z.number(),
});

export const FriendSchema = z.object({
  username: z.string(),
  profilePicture: z.string(),
  addTime: z.number(),
  favourite: z.boolean(),
});

export const FriendEntrySchema = z.object({
  timestamp: z.number(),
  profileUrl: z.string(),
});

// Search response schema
export const AccountSearchResponseSchema = z.record(z.string(), z.string());

// Export types derived from schemas
export type ApiImage = z.infer<typeof ApiImageSchema>;
export type SpotifyArtist = z.infer<typeof SpotifyArtistSchema>;
export type SpotifyAlbum = z.infer<typeof SpotifyAlbumSchema>;
export type SpotifyTrack = z.infer<typeof SpotifyTrackSchema>;
export type SpotifyPlaylist = z.infer<typeof SpotifyPlaylistSchema>;
export type SpotifyAccount = z.infer<typeof SpotifyAccountSchema>;
export type MusicTrack = z.infer<typeof MusicTrackSchema>;
export type MusicPlaylistMeta = z.infer<typeof MusicPlaylistMetaSchema>;
export type MusicPlaylistImportResult = z.infer<typeof MusicPlaylistImportResultSchema>;
export type MusicPlaylistImportFriendResult = z.infer<typeof MusicPlaylistImportFriendResultSchema>;
export type UserAccountProps = z.infer<typeof UserAccountPropsSchema>;
export type UserAccount = z.infer<typeof UserAccountSchema>;
export type FriendApiResponse = z.infer<typeof FriendApiResponseSchema>;
export type Friend = z.infer<typeof FriendSchema>;
export type FriendEntry = z.infer<typeof FriendEntrySchema>;
export type AccountSearchResponse = z.infer<typeof AccountSearchResponseSchema>; 