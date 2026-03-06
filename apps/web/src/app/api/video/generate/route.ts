import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@supabase/supabase-js";
import { spawn } from "child_process";
import { writeFile, mkdir, unlink, readdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import {
    buildFFmpegCommand,
    VIDEO_PRESETS,
    getEncodingConfig,
    calculateTotalDuration,
    type TextOverlay,
} from "@/server/services/ffmpeg-builder";
import { generateLoveStoryText } from "@/server/services/ai-text";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface GenerateRequest {
    videoId: string;
    photoUrls: string[];
    style: string;
    music: string;
    duration: string;
    resolution: string;
    hasWatermark: boolean;
    coupleInfo?: {
        groomName?: string;
        brideName?: string;
        weddingDate?: string;
        howWeMet?: string;
    };
}

/**
 * POST /api/video/generate
 * Internal API for FFmpeg video generation.
 * Called by the video tRPC router in fire-and-forget mode.
 */
export async function POST(req: NextRequest) {
    const body: GenerateRequest = await req.json();
    const { videoId } = body;

    // Use service role for all DB updates (this runs async, no user session)
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const workDir = join(tmpdir(), `lovestory-video-${randomUUID()}`);

    try {
        await mkdir(workDir, { recursive: true });

        // Update progress: downloading photos
        await updateStatus(supabase, videoId, "processing", 10);

        // 1. Download photos to local temp directory
        const photoPaths: string[] = [];
        for (let i = 0; i < body.photoUrls.length; i++) {
            const photoPath = join(workDir, `photo_${i}.jpg`);
            try {
                const res = await fetch(body.photoUrls[i]);
                if (!res.ok) throw new Error(`Failed to download photo ${i}`);
                const arrayBuffer = await res.arrayBuffer();
                await writeFile(photoPath, Buffer.from(arrayBuffer));
                photoPaths.push(photoPath);
            } catch (err) {
                console.error(`Failed to download photo ${i}:`, err);
                // Skip failed photos
            }
        }

        if (photoPaths.length < 3) {
            await updateStatus(
                supabase,
                videoId,
                "failed",
                0,
                "Cần tối thiểu 3 ảnh hợp lệ để tạo video",
            );
            return NextResponse.json({ error: "Not enough photos" }, { status: 400 });
        }

        await updateStatus(supabase, videoId, "processing", 30);

        // 2. Generate AI love story text
        const aiText = await generateLoveStoryText(
            body.coupleInfo || {},
            body.style,
        );

        await updateStatus(supabase, videoId, "processing", 40);

        // 3. Build FFmpeg command
        const preset = VIDEO_PRESETS[body.style] || VIDEO_PRESETS.cinematic;
        const encoding = getEncodingConfig(body.resolution);
        const totalDuration = calculateTotalDuration(photoPaths.length, preset);
        const outputPath = join(workDir, "output.mp4");

        // Create text overlays from AI-generated content
        const textOverlays: TextOverlay[] = [
            {
                text: aiText.title,
                startTime: 0,
                endTime: Math.min(4, totalDuration),
                fontSize: Math.round(encoding.width / 20),
                position: "center",
                color: preset.textColor,
            },
            {
                text: aiText.dateFormatted,
                startTime: 2,
                endTime: Math.min(6, totalDuration),
                fontSize: Math.round(encoding.width / 40),
                position: "bottom",
                color: preset.textColor,
            },
        ];

        // Add love story text in the middle
        if (totalDuration > 10) {
            textOverlays.push({
                text: aiText.loveStory.substring(0, 60),
                startTime: Math.floor(totalDuration / 3),
                endTime: Math.floor(totalDuration / 3) + 5,
                fontSize: Math.round(encoding.width / 50),
                position: "center",
                color: "white",
            });
        }

        // Add closing text
        textOverlays.push({
            text: aiText.closing,
            startTime: totalDuration - 4,
            endTime: totalDuration,
            fontSize: Math.round(encoding.width / 30),
            position: "center",
            color: preset.textColor,
        });

        const ffmpegArgs = buildFFmpegCommand({
            photos: photoPaths,
            width: encoding.width,
            height: encoding.height,
            fps: 25,
            preset,
            textOverlays,
            outputPath,
            watermark: body.hasWatermark ? "lovestory.app" : undefined,
            crf: encoding.crf,
            encodingPreset: encoding.preset,
        });

        await updateStatus(supabase, videoId, "processing", 50);

        // 4. Execute FFmpeg
        const startTime = Date.now();

        await new Promise<void>((resolve, reject) => {
            const ffmpeg = spawn("ffmpeg", ffmpegArgs);
            let stderr = "";

            ffmpeg.stderr.on("data", (data) => {
                stderr += data.toString();
                // Parse progress from FFmpeg output (optional)
                const timeMatch = stderr.match(/time=(\d+):(\d+):(\d+)/);
                if (timeMatch) {
                    const secs =
                        parseInt(timeMatch[1]) * 3600 +
                        parseInt(timeMatch[2]) * 60 +
                        parseInt(timeMatch[3]);
                    const pct = Math.min(
                        95,
                        50 + Math.floor((secs / totalDuration) * 45),
                    );
                    // Fire-and-forget progress update
                    updateStatus(
                        supabase,
                        videoId,
                        "processing",
                        pct,
                    ).catch(() => { });
                }
            });

            ffmpeg.on("error", (err) => {
                reject(
                    new Error(
                        `FFmpeg not found: ${err.message}. Install with: brew install ffmpeg`,
                    ),
                );
            });

            ffmpeg.on("close", (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    const lastLines = stderr.split("\n").slice(-5).join("\n");
                    reject(new Error(`FFmpeg exited with code ${code}: ${lastLines}`));
                }
            });
        });

        const renderDuration = Date.now() - startTime;
        await updateStatus(supabase, videoId, "processing", 95);

        // 5. Upload to Supabase Storage (or R2 in production)
        const { readFile } = await import("fs/promises");
        const videoBuffer = await readFile(outputPath);

        const storagePath = `videos/${videoId}/output.mp4`;
        const { error: uploadError } = await supabase.storage
            .from("media")
            .upload(storagePath, videoBuffer, {
                contentType: "video/mp4",
                upsert: true,
            });

        if (uploadError) {
            console.error("Upload failed:", uploadError);
            // Try to get a public URL anyway
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("media")
            .getPublicUrl(storagePath);

        const outputUrl = urlData?.publicUrl || "";

        // 6. Generate thumbnail (first frame)
        const thumbnailPath = join(workDir, "thumb.jpg");
        try {
            await new Promise<void>((resolve) => {
                const thumb = spawn("ffmpeg", [
                    "-i", outputPath,
                    "-ss", "3",
                    "-vframes", "1",
                    "-q:v", "5",
                    "-y", thumbnailPath,
                ]);
                thumb.on("close", () => resolve());
                thumb.on("error", () => resolve());
            });

            const thumbBuffer = await readFile(thumbnailPath).catch(
                () => null,
            );
            if (thumbBuffer) {
                const thumbPath = `videos/${videoId}/thumb.jpg`;
                await supabase.storage
                    .from("media")
                    .upload(thumbPath, thumbBuffer, {
                        contentType: "image/jpeg",
                        upsert: true,
                    });
            }
        } catch {
            console.warn("Thumbnail generation failed, continuing...");
        }

        // 7. Update DB — mark as complete
        const thumbUrl =
            supabase.storage
                .from("media")
                .getPublicUrl(`videos/${videoId}/thumb.jpg`).data?.publicUrl ||
            "";

        await supabase
            .from("videos")
            .update({
                status: "complete",
                progress: 100,
                output_url: outputUrl,
                preview_url: outputUrl,
                thumbnail_url: thumbUrl,
                duration_seconds: Math.round(totalDuration),
                render_duration_ms: renderDuration,
                completed_at: new Date().toISOString(),
            })
            .eq("id", videoId);

        // 8. Cleanup temp files
        await cleanupWorkDir(workDir);

        return NextResponse.json({
            success: true,
            videoId,
            outputUrl,
            duration: Math.round(totalDuration),
            renderTime: Math.round(renderDuration / 1000),
        });
    } catch (err) {
        console.error("Video generation failed:", err);
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error";

        await updateStatus(supabase, videoId, "failed", 0, errorMessage);

        // Cleanup on failure
        await cleanupWorkDir(workDir);

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 },
        );
    }
}

async function updateStatus(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase: any,
    videoId: string,
    status: string,
    progress: number,
    errorMessage?: string,
): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: Record<string, any> = { status, progress };
    if (errorMessage) update.error_message = errorMessage;

    await supabase.from("videos").update(update).eq("id", videoId);
}

async function cleanupWorkDir(workDir: string): Promise<void> {
    try {
        const files = await readdir(workDir);
        for (const file of files) {
            await unlink(join(workDir, file)).catch(() => { });
        }
        const { rmdir } = await import("fs/promises");
        await rmdir(workDir).catch(() => { });
    } catch {
        // Ignore cleanup errors
    }
}
