import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay — only in production, 10% of sessions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0, // Always capture replays on error

  // Debug off in production
  debug: false,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: false,
    }),
  ],

  // Ignore common noise errors
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error exception captured",
    /^chrome-extension:/,
    /^moz-extension:/,
  ],

  beforeSend(event) {
    // Strip PII from URLs
    if (event.request?.url) {
      event.request.url = event.request.url.replace(
        /\/i\/([a-zA-Z0-9-]+)/,
        "/i/[slug]"
      );
    }
    return event;
  },
});
