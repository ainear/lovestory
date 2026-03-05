import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { getUploadUrl, deleteFile } from "@/server/services/r2";
import { randomUUID } from "crypto";

export const mediaRouter = router({
    getUploadUrl: protectedProcedure
        .input(
            z.object({
                fileName: z.string().min(1),
                contentType: z.string().min(1),
                type: z.enum(["images", "music"]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const ext = input.fileName.split(".").pop();
            const key = `users/${ctx.user.id}/${input.type}/${randomUUID()}.${ext}`;
            const { url } = await getUploadUrl(key, input.contentType);

            return { uploadUrl: url, key, publicUrl: `${process.env.R2_PUBLIC_URL}/${key}` };
        }),

    delete: protectedProcedure
        .input(z.object({ key: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // Verify ownership via key prefix
            if (!input.key.startsWith(`users/${ctx.user.id}/`)) {
                throw new Error("Không có quyền xóa file này");
            }
            await deleteFile(input.key);
            return { success: true };
        }),
});
