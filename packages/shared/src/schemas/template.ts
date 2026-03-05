import { z } from "zod";

export const templateSchema = z.object({
    id: z.string().uuid(),
    slug: z.string().min(1),
    name: z.string().min(1).max(200),
    thumbnailUrl: z.string().url().optional(),
    category: z.enum([
        "wedding",
        "birthday",
        "graduation",
        "event",
        "anniversary",
        "wish",
        "other",
    ]),
    tier: z.enum(["basic", "premium"]),
    layoutJson: z.record(z.unknown()),
    usageCount: z.number().int().default(0),
    likesCount: z.number().int().default(0),
    isActive: z.boolean().default(true),
    createdAt: z.string().datetime(),
});

export const templateFilterSchema = z.object({
    category: z
        .enum([
            "wedding",
            "birthday",
            "graduation",
            "event",
            "anniversary",
            "wish",
            "other",
        ])
        .optional(),
    tier: z.enum(["basic", "premium"]).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(50).default(12),
});

export type Template = z.infer<typeof templateSchema>;
export type TemplateFilter = z.infer<typeof templateFilterSchema>;
