import { z } from 'zod';
import { 
  MusicPlaylistImportResultSchema,
  FriendApiResponseSchema,
  AccountSearchResponseSchema,
  SpotifyPlaylistSchema,
  SpotifyTrackSchema,
  SpotifyAccountSchema,
  UserAccountSchema
} from './schemas';

/**
 * Validates API response data against a Zod schema
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validated data or throws an error
 */
export function validateApiResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safely validates API response data against a Zod schema
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validated data or null if validation fails
 */
export function safeValidateApiResponse<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('API response validation failed:', error);
    return null;
  }
}

/**
 * Validates and transforms API response data
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate and transform
 * @returns The validated and transformed data
 */
export function validateAndTransform<T, U>(schema: z.ZodSchema<T, any, U>, data: U): T {
  return schema.parse(data);
}

// Specific validation functions for common API responses
export const validateMusicPlaylistImportResult = (data: unknown) => 
  validateApiResponse(MusicPlaylistImportResultSchema, data);

export const validateFriendApiResponse = (data: unknown) => 
  validateApiResponse(z.array(FriendApiResponseSchema), data);

export const validateAccountSearchResponse = (data: unknown) => 
  validateApiResponse(AccountSearchResponseSchema, data);

export const validateSpotifyPlaylist = (data: unknown) => 
  validateApiResponse(SpotifyPlaylistSchema, data);

export const validateSpotifyTrack = (data: unknown) => 
  validateApiResponse(SpotifyTrackSchema, data);

export const validateSpotifyAccount = (data: unknown) => 
  validateApiResponse(SpotifyAccountSchema, data);

export const validateUserAccount = (data: unknown) => 
  validateApiResponse(UserAccountSchema, data);

// Safe validation functions
export const safeValidateMusicPlaylistImportResult = (data: unknown) => 
  safeValidateApiResponse(MusicPlaylistImportResultSchema, data);

export const safeValidateFriendApiResponse = (data: unknown) => 
  safeValidateApiResponse(z.array(FriendApiResponseSchema), data);

export const safeValidateAccountSearchResponse = (data: unknown) => 
  safeValidateApiResponse(AccountSearchResponseSchema, data); 