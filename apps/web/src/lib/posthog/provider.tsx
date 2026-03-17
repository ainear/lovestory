"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect } from "react";

// Track page views on route change
function PostHogPageView() {
  const ph = usePostHog();

  useEffect(() => {
    // posthog-js automatically captures page views with SPA routing
    // This component is a hook to extend tracking if needed
    return () => {};
  }, [ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    posthog.init(key, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      // Respect user privacy
      respect_dnt: true,
      // Don't capture on localhost
      loaded(ph) {
        if (process.env.NODE_ENV === "development") {
          ph.opt_out_capturing();
        }
      },
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}

// ── Analytics helper — call these from feature components ──

export function trackEditorOpen(projectId: string, templateId?: string) {
  posthog.capture("editor_open", { projectId, templateId });
}

export function trackTemplateChange(projectId: string, templateId: string) {
  posthog.capture("template_change", { projectId, templateId });
}

export function trackPublish(projectId: string, slug: string) {
  posthog.capture("invitation_published", { projectId, slug });
}

export function trackPaymentStart(plan: string, amount: number) {
  posthog.capture("payment_start", { plan, amount });
}

export function trackPaymentSuccess(plan: string, amount: number) {
  posthog.capture("payment_success", { plan, amount });
}

export function trackVideoGenerated(projectId: string, style: string) {
  posthog.capture("video_generated", { projectId, style });
}
