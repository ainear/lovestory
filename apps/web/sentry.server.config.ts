import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Lower sample rate for server to control cost
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,

  debug: false,

  // Capture all unhandled promise rejections
  integrations: [Sentry.captureConsoleIntegration({ levels: ["error"] })],
});
