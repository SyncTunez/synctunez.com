// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4bd8e41dc45709d5d80ed700bf7f53ba@o4509745066868736.ingest.de.sentry.io/4509745068245072",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Configure beforeSend to filter out certain errors or add context
  beforeSend(event, hint) {
    // Add client-specific context
    event.tags = {
      ...event.tags,
      environment: process.env.NODE_ENV || 'development',
      client: true,
    };

    // Filter out certain types of errors if needed
    if (event.exception) {
      const exception = event.exception.values?.[0];
      if (exception?.type === 'NetworkError' && exception?.value?.includes('Failed to fetch')) {
        return null; // Don't send network fetch errors
      }
    }

    return event;
  },

  // Configure beforeSendTransaction for performance monitoring
  beforeSendTransaction(event) {
    // Add client-specific context to transactions
    event.tags = {
      ...event.tags,
      environment: process.env.NODE_ENV || 'development',
      client: true,
    };

    return event;
  },

  // Add environment-specific configuration
  environment: process.env.NODE_ENV || 'development',

  // Configure release tracking
  release: process.env.npm_package_version || '1.0.0',

  // Add client-specific tags
  initialScope: {
    tags: {
      client: true,
      platform: 'nextjs',
    },
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;