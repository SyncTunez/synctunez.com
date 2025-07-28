import * as Sentry from '@sentry/nextjs';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  responseData?: any;
  requestData?: any;
  sseEventName?: string;
  sseUrl?: string;
  reconnectAttempts?: number;
  eventSourceState?: number;
  additionalData?: Record<string, any>;
}

export interface SSEErrorContext extends ErrorContext {
  sseEventName: string;
  sseUrl: string;
  reconnectAttempts?: number;
  eventSourceState?: number;
  lastEventId?: string;
  eventType?: string;
  eventData?: any;
}

export interface APIErrorContext extends ErrorContext {
  endpoint: string;
  method: string;
  statusCode: number;
  responseData?: any;
  requestData?: any;
  headers?: Record<string, string>;
}

export interface ComponentErrorContext extends ErrorContext {
  component: string;
  action: string;
  props?: Record<string, any>;
  state?: Record<string, any>;
}

/**
 * Capture a general error with detailed context
 */
export function captureError(
  error: Error | string,
  context: ErrorContext = {},
  level: Sentry.SeverityLevel = 'error'
) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorObject = typeof error === 'string' ? new Error(error) : error;

  Sentry.withScope((scope) => {
    // Set the error level
    scope.setLevel(level);

    // Add user context
    if (context.userId) {
      scope.setUser({ id: context.userId });
    }

    // Add tags for easier filtering
    if (context.component) {
      scope.setTag('component', context.component);
    }
    if (context.action) {
      scope.setTag('action', context.action);
    }
    if (context.method) {
      scope.setTag('method', context.method);
    }
    if (context.statusCode) {
      scope.setTag('status_code', context.statusCode.toString());
    }

    // Add extra context data
    scope.setExtras({
      ...context,
      userAgent: context.userAgent || (typeof window !== 'undefined' ? window.navigator.userAgent : undefined),
      url: context.url || (typeof window !== 'undefined' ? window.location.href : undefined),
      timestamp: new Date().toISOString(),
    });

    Sentry.captureException(errorObject);
  });
}

/**
 * Capture SSE-specific errors with detailed context
 */
export function captureSSEError(
  error: Error | string,
  context: SSEErrorContext,
  level: Sentry.SeverityLevel = 'error'
) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorObject = typeof error === 'string' ? new Error(error) : error;

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.setTag('error_type', 'sse');
    scope.setTag('sse_event_name', context.sseEventName);
    scope.setTag('sse_url', context.sseUrl);

    if (context.userId) {
      scope.setUser({ id: context.userId });
    }

    scope.setExtras({
      ...context,
      userAgent: context.userAgent || (typeof window !== 'undefined' ? window.navigator.userAgent : undefined),
      url: context.url || (typeof window !== 'undefined' ? window.location.href : undefined),
      timestamp: new Date().toISOString(),
      eventSourceStates: {
        0: 'CONNECTING',
        1: 'OPEN',
        2: 'CLOSED'
      }
    });

    Sentry.captureException(errorObject);
  });
}

/**
 * Capture API-specific errors with detailed context
 */
export function captureAPIError(
  error: Error | string,
  context: APIErrorContext,
  level: Sentry.SeverityLevel = 'error'
) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorObject = typeof error === 'string' ? new Error(error) : error;

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.setTag('error_type', 'api');
    scope.setTag('endpoint', context.endpoint);
    scope.setTag('method', context.method);
    scope.setTag('status_code', context.statusCode.toString());

    if (context.userId) {
      scope.setUser({ id: context.userId });
    }

    scope.setExtras({
      ...context,
      userAgent: context.userAgent || (typeof window !== 'undefined' ? window.navigator.userAgent : undefined),
      url: context.url || (typeof window !== 'undefined' ? window.location.href : undefined),
      timestamp: new Date().toISOString(),
    });

    Sentry.captureException(errorObject);
  });
}

/**
 * Capture component-specific errors with detailed context
 */
export function captureComponentError(
  error: Error | string,
  context: ComponentErrorContext,
  level: Sentry.SeverityLevel = 'error'
) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorObject = typeof error === 'string' ? new Error(error) : error;

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.setTag('error_type', 'component');
    scope.setTag('component', context.component);
    scope.setTag('action', context.action);

    if (context.userId) {
      scope.setUser({ id: context.userId });
    }

    scope.setExtras({
      ...context,
      userAgent: context.userAgent || (typeof window !== 'undefined' ? window.navigator.userAgent : undefined),
      url: context.url || (typeof window !== 'undefined' ? window.location.href : undefined),
      timestamp: new Date().toISOString(),
    });

    Sentry.captureException(errorObject);
  });
}

/**
 * Capture authentication-related errors
 */
export function captureAuthError(
  error: Error | string,
  context: ErrorContext & { authProvider?: string; authStep?: string },
  level: Sentry.SeverityLevel = 'error'
) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorObject = typeof error === 'string' ? new Error(error) : error;

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.setTag('error_type', 'authentication');
    if (context.authProvider) {
      scope.setTag('auth_provider', context.authProvider);
    }
    if (context.authStep) {
      scope.setTag('auth_step', context.authStep);
    }

    if (context.userId) {
      scope.setUser({ id: context.userId });
    }

    scope.setExtras({
      ...context,
      userAgent: context.userAgent || (typeof window !== 'undefined' ? window.navigator.userAgent : undefined),
      url: context.url || (typeof window !== 'undefined' ? window.location.href : undefined),
      timestamp: new Date().toISOString(),
    });

    Sentry.captureException(errorObject);
  });
}

/**
 * Capture form validation errors
 */
export function captureValidationError(
  error: Error | string,
  context: ErrorContext & { formName?: string; fieldName?: string; validationRule?: string },
  level: Sentry.SeverityLevel = 'warning'
) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorObject = typeof error === 'string' ? new Error(error) : error;

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.setTag('error_type', 'validation');
    if (context.formName) {
      scope.setTag('form_name', context.formName);
    }
    if (context.fieldName) {
      scope.setTag('field_name', context.fieldName);
    }
    if (context.validationRule) {
      scope.setTag('validation_rule', context.validationRule);
    }

    if (context.userId) {
      scope.setUser({ id: context.userId });
    }

    scope.setExtras({
      ...context,
      userAgent: context.userAgent || (typeof window !== 'undefined' ? window.navigator.userAgent : undefined),
      url: context.url || (typeof window !== 'undefined' ? window.location.href : undefined),
      timestamp: new Date().toISOString(),
    });

    Sentry.captureException(errorObject);
  });
}

/**
 * Capture performance-related errors
 */
export function capturePerformanceError(
  error: Error | string,
  context: ErrorContext & { operation?: string; duration?: number; threshold?: number },
  level: Sentry.SeverityLevel = 'warning'
) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorObject = typeof error === 'string' ? new Error(error) : error;

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.setTag('error_type', 'performance');
    if (context.operation) {
      scope.setTag('operation', context.operation);
    }

    if (context.userId) {
      scope.setUser({ id: context.userId });
    }

    scope.setExtras({
      ...context,
      userAgent: context.userAgent || (typeof window !== 'undefined' ? window.navigator.userAgent : undefined),
      url: context.url || (typeof window !== 'undefined' ? window.location.href : undefined),
      timestamp: new Date().toISOString(),
    });

    Sentry.captureException(errorObject);
  });
}

/**
 * Set user context for all subsequent error reports
 */
export function setUserContext(userId: string, userData?: Record<string, any>) {
  Sentry.setUser({
    id: userId,
    ...userData
  });
}

/**
 * Clear user context
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, any>,
  level: Sentry.SeverityLevel = 'info'
) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level,
    timestamp: Date.now() / 1000,
  });
} 