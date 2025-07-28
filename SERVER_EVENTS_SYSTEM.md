# ServerEvents System Documentation

## Overview

The ServerEvents system provides a robust, production-ready implementation for Server-Sent Events (SSE) with automatic reconnection, comprehensive error handling, and Sentry integration.

## Architecture

### Core Components

1. **`lib/api/ServerEvents.ts`** - Core SSE implementation
2. **`hooks/useServerEvents.ts`** - React hook wrapper
3. **`lib/sentry.ts`** - Error tracking and breadcrumbs

## Features

### ✅ Graceful Reconnection
- **Exponential backoff** with configurable delays
- **Maximum retry attempts** to prevent infinite loops
- **Connection state tracking** for debugging
- **Automatic cleanup** of timers and connections

### ✅ Comprehensive Error Handling
- **Sentry integration** with detailed error context
- **Breadcrumb tracking** for debugging connection issues
- **Validation error reporting** for malformed data
- **Connection timeout handling**

### ✅ Production-Ready Features
- **Heartbeat monitoring** to detect stale connections
- **Connection ID tracking** for debugging multiple connections
- **Configurable options** for different use cases
- **TypeScript support** with full type safety

## Usage

### Basic Usage with React Hook

```typescript
import { useServerEvents } from '@/hooks/useServerEvents';
import { SpotifyAccountSchema } from '@/lib/api/schemas';
import { buildUrl } from '@/lib/api/apiClient';

function MyComponent() {
  const { isConnected } = useServerEvents<SpotifyAccount>(
    buildUrl('spotify/account'),
    'SpotifyAccount',
    SpotifyAccountSchema,
    (data) => {
      console.log('Received Spotify account:', data);
    },
    {
      enabled: true,
      maxReconnectAttempts: 5,
      initialReconnectDelay: 2000,
      heartbeatInterval: 15000
    }
  );

  return (
    <div>
      Connection status: {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );
}
```

### Direct Usage (for non-React contexts)

```typescript
import { useServerEvents } from '@/lib/api/ServerEvents';
import { SpotifyAccountSchema } from '@/lib/api/schemas';
import { buildUrl } from '@/lib/api/apiClient';

async function connectToSpotify() {
  try {
    const eventSource = await useServerEvents<SpotifyAccount>(
      buildUrl('spotify/account'),
      'SpotifyAccount',
      SpotifyAccountSchema,
      (data) => {
        console.log('Received data:', data);
      },
      {
        maxReconnectAttempts: 10,
        initialReconnectDelay: 1000,
        maxReconnectDelay: 30000,
        reconnectBackoffMultiplier: 2,
        heartbeatInterval: 30000,
        connectionTimeout: 10000
      }
    );

    // Cleanup when done
    return () => eventSource.close();
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
```

## Configuration Options

### ServerEventsOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxReconnectAttempts` | `number` | `10` | Maximum number of reconnection attempts |
| `initialReconnectDelay` | `number` | `1000` | Initial delay before first reconnection (ms) |
| `maxReconnectDelay` | `number` | `30000` | Maximum delay between reconnection attempts (ms) |
| `reconnectBackoffMultiplier` | `number` | `2` | Multiplier for exponential backoff |
| `heartbeatInterval` | `number` | `30000` | Interval for heartbeat monitoring (ms) |
| `connectionTimeout` | `number` | `10000` | Timeout for initial connection (ms) |
| `enabled` | `boolean` | `true` | Whether the connection should be active (React hook only) |

## Error Handling

### Sentry Integration

All errors are automatically captured with detailed context:

```typescript
// Error context includes:
{
  sseEventName: 'SpotifyAccount',
  sseUrl: '/api/events/SpotifyAccount',
  connectionId: 'sse_1234567890_abc123',
  reconnectAttempts: 3,
  eventSourceState: 0, // CONNECTING
  validationErrors: [], // If data validation fails
  parseError: 'JSON parse error', // If JSON parsing fails
  fetchUrl: 'http://localhost:3000/api/spotify/account'
}
```

### Breadcrumb Tracking

The system automatically creates breadcrumbs for debugging:

- **Connection attempts**
- **Connection opened**
- **Connection errors**
- **Reconnection scheduled**
- **Message received**
- **Connection closed**
- **Heartbeat events**

## Best Practices

### 1. Use React Hook for Components

```typescript
// ✅ Good - React hook with automatic cleanup
const { isConnected } = useServerEvents<MyDataType>(
  url,
  eventName,
  schema,
  onEvent,
  options
);

// ❌ Avoid - Manual connection management in components
useEffect(() => {
  const eventSource = await useServerEvents(...);
  return () => eventSource.close();
}, []);
```

### 2. Configure Appropriate Timeouts

```typescript
// ✅ Good - Conservative settings for production
{
  maxReconnectAttempts: 5,
  initialReconnectDelay: 2000,
  maxReconnectDelay: 30000,
  heartbeatInterval: 30000,
  connectionTimeout: 10000
}

// ✅ Good - Aggressive settings for real-time features
{
  maxReconnectAttempts: 10,
  initialReconnectDelay: 500,
  maxReconnectDelay: 5000,
  heartbeatInterval: 15000,
  connectionTimeout: 5000
}
```

### 3. Handle Connection States

```typescript
const { isConnected, disconnect, connect } = useServerEvents(...);

return (
  <div>
    <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
    <button onClick={disconnect}>Disconnect</button>
    <button onClick={connect}>Reconnect</button>
  </div>
);
```

### 4. Use Proper Schema Validation

```typescript
// ✅ Good - Strong typing with validation
const { isConnected } = useServerEvents<SpotifyAccount>(
  url,
  eventName,
  SpotifyAccountSchema, // Zod schema for validation
  onEvent
);

// ❌ Avoid - No validation
const { isConnected } = useServerEvents<any>(
  url,
  eventName,
  z.any(), // No validation
  onEvent
);
```

## Debugging

### Connection Issues

1. **Check Sentry logs** for detailed error context
2. **Monitor breadcrumbs** for connection lifecycle
3. **Verify URL routing** - ensure `/api/events/` is properly proxied
4. **Check backend logs** for server-side issues

### Common Issues

1. **Content-Type errors**: Usually indicate incorrect routing
2. **Connection timeouts**: May need to adjust `connectionTimeout`
3. **Frequent reconnections**: May need to adjust reconnection settings
4. **Validation errors**: Check data format from backend

## Migration Guide

### From useSSE (deprecated)

```typescript
// ❌ Old way
import { useSSE } from '@/hooks/useSSE';

useSSE<MyType>(url, eventName, onEvent, { reconnectIntervalMs: 5000 });

// ✅ New way
import { useServerEvents } from '@/hooks/useServerEvents';

const { isConnected } = useServerEvents<MyType>(
  url,
  eventName,
  schema,
  onEvent,
  { initialReconnectDelay: 5000 }
);
```

### From useLiveResource (deprecated)

```typescript
// ❌ Old way
import { useLiveResourceJson } from '@/hooks/useLiveResource';

const { data, error } = useLiveResourceJson<MyType>({
  fetchUrl: url,
  eventName: 'MyEvent',
  reconnectIntervalMs: 5000
});

// ✅ New way
import { useServerEvents } from '@/hooks/useServerEvents';

const [data, setData] = useState<MyType | null>(null);
const { isConnected } = useServerEvents<MyType>(
  url,
  'MyEvent',
  schema,
  setData,
  { initialReconnectDelay: 5000 }
);
```

## Performance Considerations

1. **Connection pooling**: The system automatically manages connections
2. **Memory cleanup**: Timers and event sources are properly cleaned up
3. **Reconnection limits**: Prevents infinite reconnection loops
4. **Heartbeat monitoring**: Detects stale connections early

## Security

1. **Credential handling**: Uses `withCredentials: true` for authenticated requests
2. **URL validation**: Only connects to configured API routes
3. **Error sanitization**: Sensitive data is not logged to Sentry
4. **Connection limits**: Prevents resource exhaustion attacks 