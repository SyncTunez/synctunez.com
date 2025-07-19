# Zod Usage Guide for SyncTunez

This project uses [Zod](https://zod.dev/) for runtime type validation and schema definition. Zod provides excellent TypeScript integration and helps ensure data integrity throughout the application.

## Overview

Zod is already installed and configured in this project. We've created a comprehensive schema system in `lib/api/schemas.ts` that covers all API types and form validations.

## Key Files

- `lib/api/schemas.ts` - All Zod schemas for API types and forms
- `lib/api/validation.ts` - Utility functions for API validation
- `lib/api/types.ts` - TypeScript types derived from Zod schemas

## Available Schemas

### API Response Schemas
- `MusicPlaylistImportResultSchema` - For playlist import results
- `FriendApiResponseSchema` - For friend API responses
- `AccountSearchResponseSchema` - For account search results
- `SpotifyPlaylistSchema` - For Spotify playlist data
- `SpotifyTrackSchema` - For Spotify track data
- `SpotifyAccountSchema` - For Spotify account data
- `UserAccountSchema` - For user account data

### Form Schemas
- `RegisterFormSchema` - For user registration forms
- `AddFriendFormSchema` - For adding friends

## Usage Examples

### 1. Form Validation with React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema } from "@/lib/api/schemas";
import type { z } from "zod";

const form = useForm<z.infer<typeof RegisterFormSchema>>({
  resolver: zodResolver(RegisterFormSchema),
  defaultValues: {
    username: "",
  },
});

const onSubmit = (data: z.infer<typeof RegisterFormSchema>) => {
  // data is fully typed and validated
  console.log(data.username);
};
```

### 2. API Response Validation

```tsx
import { safeValidateMusicPlaylistImportResult } from "@/lib/api/validation";

// In your API call handler
const handleApiResponse = (data: unknown) => {
  const validatedData = safeValidateMusicPlaylistImportResult(data);
  if (validatedData) {
    // Use the validated data
    setPlaylists(validatedData);
  } else {
    // Handle validation error
    console.error("Invalid API response");
  }
};
```

### 3. Direct Schema Validation

```tsx
import { MusicPlaylistImportResultSchema } from "@/lib/api/schemas";

try {
  const validatedData = MusicPlaylistImportResultSchema.parse(rawData);
  // Use validatedData
} catch (error) {
  // Handle validation error
  console.error("Validation failed:", error);
}
```

### 4. Using with useLiveResourceJson

```tsx
import { useLiveResourceJson } from '@/hooks/useLiveResource';
import { safeValidateFriendApiResponse } from '@/lib/api/validation';

useLiveResourceJson<FriendApiResponse[]>({
  fetchUrl: buildUrl('account/friends'),
  eventName: 'AccountFriends',
  onMessage: (data) => {
    const validatedData = safeValidateFriendApiResponse(data);
    if (validatedData) {
      setFriends(validatedData);
    }
  },
});
```

## Best Practices

### 1. Always Validate API Responses
Use the validation utilities in `lib/api/validation.ts` to ensure API responses match expected schemas.

### 2. Use Type Inference
Let TypeScript infer types from Zod schemas:
```tsx
import type { MusicPlaylistImportResult } from '@/lib/api/types';
// This type is automatically derived from MusicPlaylistImportResultSchema
```

### 3. Handle Validation Errors Gracefully
Use `safeValidateApiResponse` for non-critical validations where you want to continue execution even if validation fails.

### 4. Extend Schemas When Needed
If you need to add new schemas, add them to `lib/api/schemas.ts` and export the corresponding types.

## Adding New Schemas

To add a new schema:

1. Add the schema to `lib/api/schemas.ts`:
```tsx
export const NewApiResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  // ... other fields
});
```

2. Export the type:
```tsx
export type NewApiResponse = z.infer<typeof NewApiResponseSchema>;
```

3. Add validation functions to `lib/api/validation.ts`:
```tsx
export const validateNewApiResponse = (data: unknown) => 
  validateApiResponse(NewApiResponseSchema, data);
```

4. Re-export the type in `lib/api/types.ts` for backward compatibility.

## Benefits

- **Runtime Type Safety**: Catch type errors at runtime, not just compile time
- **Automatic TypeScript Types**: Types are automatically generated from schemas
- **API Contract Validation**: Ensure API responses match expected structure
- **Form Validation**: Robust form validation with excellent error messages
- **Developer Experience**: Better IntelliSense and error detection

## Migration Notes

The existing code has been updated to use Zod schemas while maintaining backward compatibility. All existing TypeScript types are now derived from Zod schemas, ensuring consistency between runtime validation and compile-time types. 