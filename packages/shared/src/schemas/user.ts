import { z } from "zod";

export const userSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    fullName: z.string().min(1).max(100).optional(),
    phone: z.string().max(20).optional(),
    bio: z.string().max(500).optional(),
    avatarUrl: z.string().url().optional(),
    birthDate: z.string().optional(),
    planTier: z.enum(["free", "basic", "premium"]).default("free"),
    authMethod: z.enum(["email", "google", "facebook"]).default("email"),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const updateProfileSchema = z.object({
    fullName: z.string().min(1).max(100).optional(),
    phone: z.string().max(20).optional(),
    bio: z.string().max(500).optional(),
    birthDate: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
