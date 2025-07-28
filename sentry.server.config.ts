// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4bd8e41dc45709d5d80ed700bf7f53ba@o4509745066868736.ingest.de.sentry.io/4509745068245072",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Add integrations for better error tracking
  integrations: [
    // Add HTTP integration for better request tracking
    Sentry.httpIntegration(),
  ],

  // Configure beforeSend to filter out certain errors or add context
  beforeSend(event, hint) {
    // Add server-specific context
    event.tags = {
      ...event.tags,
      environment: process.env.NODE_ENV || 'development',
      server: true,
    };

    // Filter out certain types of errors if needed
    if (event.exception) {
      const exception = event.exception.values?.[0];
      if (exception?.type === 'NetworkError' && exception?.value?.includes('ECONNREFUSED')) {
        return null; // Don't send connection refused errors
      }
    }

    return event;
  },

  // Configure beforeSendTransaction for performance monitoring
  beforeSendTransaction(event) {
    // Add server-specific context to transactions
    event.tags = {
      ...event.tags,
      environment: process.env.NODE_ENV || 'development',
      server: true,
    };

    return event;
  },

  // Enable performance monitoring
  // enableTracing is enabled by default in Next.js

  // Configure sampling for different types of events
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Add environment-specific configuration
  environment: process.env.NODE_ENV || 'development',

  // Configure release tracking
  release: process.env.npm_package_version || '1.0.0',

  // Add server-specific tags
  initialScope: {
    tags: {
      server: true,
      platform: 'nextjs',
    },
  },
});
