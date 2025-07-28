# Sentry Error Tracking Integration

This document describes the comprehensive Sentry error tracking implementation in the SyncTuneZ application.

## Overview

The application includes comprehensive error tracking with Sentry that covers:

- **SSE (Server-Sent Events) errors** - Connection issues, parsing errors, reconnection attempts
- **API errors** - HTTP request failures, network issues, response parsing
- **Component errors** - React component rendering errors, state management issues
- **Authentication errors** - Login/registration failures, session management
- **Validation errors** - Form validation, data parsing issues
- **Performance errors** - Slow operations, timeout issues
- **General errors** - Unhandled exceptions, unexpected errors

## Core Error Tracking Utilities

### `lib/sentry.ts`

The main Sentry utility file provides specialized error tracking functions:

#### `captureError(error, context, level)`
General error tracking with detailed context.

```typescript
captureError(
  "Something went wrong",
  {
    component: "MyComponent",
    action: "data_fetch",
    userId: "user123",
    additionalData: { /* extra context */ }
  },
  'error'
);
```

#### `captureSSEError(error, context, level)`
Specialized for Server-Sent Events errors with connection details.

```typescript
captureSSEError(
  "SSE connection failed",
  {
    sseEventName: "AccountSearch",
    sseUrl: "http://localhost:8080/events/AccountSearch",
    reconnectAttempts: 3,
    eventSourceState: 2,
    lastEventId: "123",
    eventType: "message",
    eventData: { /* event data */ }
  },
  'error'
);
```

#### `captureAPIError(error, context, level)`
Specialized for API request errors with HTTP details.

```typescript
captureAPIError(
  "API request failed",
  {
    endpoint: "/api/account/friends",
    method: "GET",
    statusCode: 500,
    responseData: { /* response data */ },
    requestData: { /* request data */ },
    headers: { /* headers */ }
  },
  'error'
);
```

#### `captureComponentError(error, context, level)`
Specialized for React component errors.

```typescript
captureComponentError(
  "Component rendering failed",
  {
    component: "FriendsCard",
    action: "render",
    props: { /* component props */ },
    state: { /* component state */ }
  },
  'error'
);
```

#### `captureAuthError(error, context, level)`
Specialized for authentication-related errors.

```typescript
captureAuthError(
  "Login failed",
  {
    authProvider: "google",
    authStep: "token_validation",
    component: "LoginForm",
    action: "login"
  },
  'error'
);
```

#### `captureValidationError(error, context, level)`
Specialized for form validation errors.

```typescript
captureValidationError(
  "Username validation failed",
  {
    formName: "registration",
    fieldName: "username",
    validationRule: "min_length",
    component: "RegisterModal",
    action: "validation"
  },
  'warning'
);
```

#### `capturePerformanceError(error, context, level)`
Specialized for performance-related issues.

```typescript
capturePerformanceError(
  "API call took too long",
  {
    operation: "fetch_friends",
    duration: 5000,
    threshold: 3000
  },
  'warning'
);
```

## Hook Integration

### `hooks/useSSE.ts`

Enhanced with comprehensive error tracking:

- **Connection errors** - Failed connections, network issues
- **Parsing errors** - JSON parsing failures
- **Reconnection attempts** - Automatic reconnection with limits
- **Event source state tracking** - Detailed connection state monitoring

```typescript
// Automatically tracks:
// - Connection attempts and failures
// - JSON parsing errors
// - Reconnection attempts (max 5)
// - Event source state changes
// - Message processing errors
```

### `hooks/useLiveResource.ts`

Enhanced with error tracking for both fetch and SSE operations:

- **Initial fetch errors** - Network issues, parsing problems
- **SSE message processing** - Event handling errors
- **Component context** - Tracks which component is using the hook
- **User context** - Associates errors with specific users

```typescript
useLiveResource({
  fetchUrl: "/api/friends",
  eventName: "FriendsUpdate",
  componentName: "FriendsCard",
  userId: "user123"
});
```

## API Client Integration

### `lib/api/apiClient.ts`

Enhanced with comprehensive request/response tracking:

- **Request interceptors** - Track all outgoing requests
- **Response interceptors** - Track all incoming responses
- **Error categorization** - Different handling for 4xx vs 5xx errors
- **Network error detection** - Timeout, connection refused, etc.

```typescript
// Automatically tracks:
// - All HTTP requests and responses
// - Network errors and timeouts
// - Response parsing errors
// - Authentication failures
```

## Component Error Boundaries

### `components/ErrorBoundary.tsx`

Comprehensive React error boundary with:

- **Error capture** - Catches all component errors
- **Fallback UI** - User-friendly error display
- **Development details** - Stack traces in development
- **Recovery options** - Try again and reload buttons
- **Sentry integration** - Automatic error reporting

```typescript
<ErrorBoundary componentName="FriendsCard" userId="user123">
  <FriendsCard />
</ErrorBoundary>
```

### Higher-order component wrapper:

```typescript
const FriendsCardWithErrorBoundary = withErrorBoundary(FriendsCard, {
  componentName: "FriendsCard",
  userId: "user123"
});
```

## Performance Monitoring

### `lib/performance.ts`

Comprehensive performance monitoring:

- **Timers** - Start/end performance timers
- **Metrics** - Record performance metrics with thresholds
- **Async measurement** - Measure async function performance
- **Sync measurement** - Measure sync function performance
- **Page load monitoring** - Automatic page load metrics
- **API call monitoring** - Automatic API call timing

```typescript
// Manual timing
startTimer("friend_search");
const results = await searchFriends();
endTimer("friend_search", 3000); // Warn if > 3s

// Async measurement
const results = await measureAsync(
  "friend_search",
  () => searchFriends(),
  3000, // threshold
  { query: "john" }
);

// Performance metrics
recordMetric({
  name: "api_response_time",
  value: 1500,
  unit: "ms",
  threshold: 2000,
  context: { endpoint: "/api/friends" }
});
```

## Configuration

### Server Configuration (`sentry.server.config.ts`)

Enhanced with:

- **HTTP integration** - Better request tracking
- **Error filtering** - Filter out connection refused errors
- **Environment tagging** - Server-specific context
- **Performance monitoring** - Transaction tracking
- **Release tracking** - Version-based error grouping

### Client Configuration (`instrumentation-client.ts`)

Enhanced with:

- **Replay integration** - Session replay for debugging
- **Error filtering** - Filter out network fetch errors
- **Environment tagging** - Client-specific context
- **Performance monitoring** - Client-side transaction tracking

## Error Context and Debug Information

All error tracking includes comprehensive debug information:

### User Context
- User ID/username
- Authentication status
- Session information

### Request Context
- URL and method
- Request headers
- Request/response data
- Status codes

### Component Context
- Component name
- Action being performed
- Props and state
- Component stack

### SSE Context
- Event name and URL
- Connection state
- Reconnection attempts
- Event data and parsing

### Performance Context
- Operation duration
- Performance thresholds
- Timing breakdowns
- Resource usage

## Breadcrumbs

The system automatically adds breadcrumbs for debugging:

- **API requests** - Request start/end
- **SSE connections** - Connection attempts, messages, errors
- **Component lifecycle** - Mount, update, unmount
- **User actions** - Form submissions, button clicks
- **Performance events** - Timer starts, measurements

## Error Levels

Different error types use appropriate severity levels:

- **Error** - Critical failures, crashes, security issues
- **Warning** - Performance issues, validation failures
- **Info** - User actions, state changes
- **Debug** - Detailed debugging information

## Best Practices

### 1. Use Specific Error Functions
```typescript
// Good
captureSSEError(error, { sseEventName: "AccountSearch", ... });

// Avoid
captureError(error, { type: "sse", ... });
```

### 2. Include Relevant Context
```typescript
captureAPIError(error, {
  endpoint: "/api/friends",
  method: "GET",
  statusCode: 500,
  userId: "user123",
  additionalData: { requestId: "req-123" }
});
```

### 3. Set Appropriate Thresholds
```typescript
// Performance monitoring
measureAsync("api_call", apiFunction, 5000); // 5s threshold

// SSE reconnection
useSSE(url, eventName, handler, { reconnectIntervalMs: 1000 });
```

### 4. Use Error Boundaries
```typescript
// Wrap critical components
<ErrorBoundary componentName="PaymentForm">
  <PaymentForm />
</ErrorBoundary>
```

### 5. Monitor Performance
```typescript
// Track slow operations
startTimer("complex_calculation");
const result = performComplexCalculation();
endTimer("complex_calculation", 1000); // Warn if > 1s
```

## Debugging

### Development Mode
- Error boundaries show detailed error information
- Performance metrics logged to console
- Breadcrumbs visible in Sentry dashboard

### Production Mode
- Error boundaries show user-friendly messages
- Performance monitoring continues
- All errors sent to Sentry with full context

## Monitoring Dashboard

The Sentry dashboard provides:

- **Error trends** - Error frequency and patterns
- **Performance metrics** - Response times, throughput
- **User impact** - Affected users and sessions
- **Release tracking** - Errors by version
- **Environment filtering** - Development vs production

## Alerting

Configure Sentry alerts for:

- **High error rates** - >5% error rate
- **Performance degradation** - >3s response times
- **Authentication failures** - Login/registration issues
- **SSE connection failures** - Persistent connection issues
- **Critical component errors** - Core functionality failures 