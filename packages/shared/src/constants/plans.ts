import type { PlanTier } from "../types/enums";

export interface PlanDefinition {
    tier: PlanTier;
    displayName: string;
    price: number; // VND, 0 for free
    maxProjects: number;
    maxPhotos: number;
    maxViews: number;
    storageDays: number;
    hasWatermark: boolean;
    customMusic: boolean;
    customFont: boolean;
    bgRemoval: boolean;
    youtubeEmbed: boolean;
    customForm: boolean;
    autoGuestName: boolean;
}

export const PLANS: Record<PlanTier, PlanDefinition> = {
    free: {
        tier: "free",
        displayName: "Free",
        price: 0,
        maxProjects: 1,
        maxPhotos: 10,
        maxViews: 300,
        storageDays: 180,
        hasWatermark: true,
        customMusic: false,
        customFont: false,
        bgRemoval: false,
        youtubeEmbed: false,
        customForm: false,
        autoGuestName: false,
    },
    basic: {
        tier: "basic",
        displayName: "Basic",
        price: 199_000,
        maxProjects: 3,
        maxPhotos: 50,
        maxViews: 10_000,
        storageDays: 730,
        hasWatermark: false,
        customMusic: true,
        customFont: false,
        bgRemoval: false,
        youtubeEmbed: false,
        customForm: false,
        autoGuestName: false,
    },
    premium: {
        tier: "premium",
        displayName: "Premium",
        price: 299_000,
        maxProjects: 5,
        maxPhotos: 100,
        maxViews: 50_000,
        storageDays: 1825,
        hasWatermark: false,
        customMusic: true,
        customFont: true,
        bgRemoval: true,
        youtubeEmbed: true,
        customForm: true,
        autoGuestName: true,
    },
};
