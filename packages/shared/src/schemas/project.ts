import { z } from "zod";

export const projectSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    templateId: z.string().uuid().optional(),
    title: z.string().min(1).max(200),
    slug: z.string().min(1),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    layoutJson: z.record(z.unknown()),
    category: z.string().optional(),
    isPublic: z.boolean().default(false),
    publishedAt: z.string().datetime().optional(),
    publishedUrl: z.string().url().optional(),
    viewCount: z.number().int().default(0),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const createProjectSchema = z.object({
    templateId: z.string().uuid(),
    title: z.string().min(1).max(200),
});

export const updateProjectSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    layoutJson: z.record(z.unknown()).optional(),
    category: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
