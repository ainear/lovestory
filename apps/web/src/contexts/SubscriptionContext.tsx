"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { createClient } from "@/lib/supabase/client";
import {
  PLANS,
  type PlanConfig,
  type PlanFeatures,
  type PlanId,
} from "@/config/plans";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SubscriptionState {
  plan: PlanId;
  config: PlanConfig;
  loading: boolean;
  hasFeature: (feature: keyof PlanFeatures) => boolean;
  canUploadImages: (currentCount: number) => boolean;
  canCreateProject: (currentCount: number) => boolean;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_PLAN: PlanId = "free";

const defaultState: SubscriptionState = {
  plan: DEFAULT_PLAN,
  config: PLANS[DEFAULT_PLAN],
  loading: true,
  hasFeature: () => false,
  canUploadImages: () => false,
  canCreateProject: () => false,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SubscriptionContext = createContext<SubscriptionState | undefined>(
  undefined,
);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanId>(DEFAULT_PLAN);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchSubscription() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || cancelled) {
          return;
        }

        const { data } = await supabase
          .from("subscriptions")
          .select("plan, expires_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!cancelled && data?.plan && data.plan in PLANS) {
          // Check if subscription has expired
          const isExpired =
            data.expires_at && new Date(data.expires_at) < new Date();
          if (!isExpired) {
            setPlan(data.plan as PlanId);
          }
        }
      } catch {
        // Default to free plan on any error
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSubscription();

    return () => {
      cancelled = true;
    };
  }, []);

  const config = PLANS[plan];

  const hasFeature = (feature: keyof PlanFeatures): boolean =>
    config.features[feature];

  const canUploadImages = (currentCount: number): boolean =>
    currentCount < config.maxImages;

  const canCreateProject = (currentCount: number): boolean =>
    currentCount < config.maxCards;

  const value: SubscriptionState = {
    plan,
    config,
    loading,
    hasFeature,
    canUploadImages,
    canCreateProject,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSubscription(): SubscriptionState {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
}
