/**
 * FFmpeg Command Builder — Video Compositing Engine
 *
 * Builds FFmpeg filter_complex commands for creating wedding videos from photos.
 * Supports Ken Burns effects, transitions, text overlays, and audio mixing.
 *
 * NOTE: Requires FFmpeg installed on the system.
 * For production, this runs in a Docker container on Fly.io.
 * For local dev, requires `brew install ffmpeg` on macOS.
 */

export interface VideoPreset {
    id: string;
    name: string;
    photoDuration: number; // seconds per photo
    transitionDuration: number; // seconds per transition
    kenBurns: {
        zoomStart: number;
        zoomEnd: number;
        panX: number;
        panY: number;
    };
    transition: string; // FFmpeg xfade transition name
    textColor: string;
    textFont: string;
    colorGrading: string; // FFmpeg colorbalance/eq filter
}

export const VIDEO_PRESETS: Record<string, VideoPreset> = {
    cinematic: {
        id: "cinematic",
        name: "Cinematic",
        photoDuration: 4,
        transitionDuration: 1,
        kenBurns: { zoomStart: 1.0, zoomEnd: 1.15, panX: 0, panY: 0 },
        transition: "fadeblack",
        textColor: "gold",
        textFont: "serif",
        colorGrading: "colorbalance=rs=0.05:gs=-0.02:bs=-0.05",
    },
    romantic: {
        id: "romantic",
        name: "Romantic",
        photoDuration: 5,
        transitionDuration: 1.5,
        kenBurns: { zoomStart: 1.0, zoomEnd: 1.1, panX: 0.02, panY: 0 },
        transition: "fade",
        textColor: "white",
        textFont: "sans-serif",
        colorGrading: "colorbalance=rs=0.08:gs=0.02:bs=0.04",
    },
    vintage: {
        id: "vintage",
        name: "Vintage",
        photoDuration: 4,
        transitionDuration: 1,
        kenBurns: { zoomStart: 1.05, zoomEnd: 1.0, panX: -0.01, panY: 0 },
        transition: "wipeleft",
        textColor: "wheat",
        textFont: "serif",
        colorGrading: "colorbalance=rs=0.1:gs=0.05:bs=-0.1,eq=saturation=0.7:contrast=1.1",
    },
    modern: {
        id: "modern",
        name: "Modern",
        photoDuration: 3,
        transitionDuration: 0.8,
        kenBurns: { zoomStart: 1.0, zoomEnd: 1.05, panX: 0, panY: 0 },
        transition: "slideleft",
        textColor: "white",
        textFont: "sans-serif",
        colorGrading: "eq=contrast=1.05:brightness=0.02",
    },
};

export interface TextOverlay {
    text: string;
    startTime: number;
    endTime: number;
    fontSize: number;
    position: "center" | "bottom" | "top";
    color: string;
}

export interface FFmpegBuildConfig {
    photos: string[]; // Local file paths to processed photos
    width: number;
    height: number;
    fps: number;
    preset: VideoPreset;
    textOverlays: TextOverlay[];
    musicPath?: string;
    outputPath: string;
    watermark?: string;
    crf: number; // Constant Rate Factor (18=high quality, 28=low)
    encodingPreset: string; // 'ultrafast' to 'veryslow'
}

/**
 * Build the complete FFmpeg command for video generation.
 * Uses zoompan for Ken Burns, xfade for transitions, drawtext for overlays.
 */
export function buildFFmpegCommand(config: FFmpegBuildConfig): string[] {
    const {
        photos,
        width,
        height,
        fps,
        preset,
        textOverlays,
        musicPath,
        outputPath,
        watermark,
        crf,
        encodingPreset,
    } = config;

    const args: string[] = [];

    // Input files
    photos.forEach((photo) => {
        args.push("-loop", "1", "-t", String(preset.photoDuration), "-i", photo);
    });

    if (musicPath) {
        args.push("-i", musicPath);
    }

    // Build filter_complex
    const filters: string[] = [];
    const totalPhotos = photos.length;

    // Step 1: Apply Ken Burns (zoompan) to each photo
    for (let i = 0; i < totalPhotos; i++) {
        const kb = preset.kenBurns;
        const zoomStep = (kb.zoomEnd - kb.zoomStart) / (preset.photoDuration * fps);
        const dFrames = preset.photoDuration * fps;

        filters.push(
            `[${i}:v]scale=${width * 2}:${height * 2},` +
            `zoompan=z='min(zoom+${zoomStep.toFixed(6)},${kb.zoomEnd})':` +
            `x='iw/2-(iw/zoom/2)+${kb.panX}*t':` +
            `y='ih/2-(ih/zoom/2)+${kb.panY}*t':` +
            `d=${dFrames}:s=${width}x${height}:fps=${fps},` +
            `setpts=PTS-STARTPTS[v${i}]`,
        );
    }

    // Step 2: Chain transitions (xfade) between segments
    if (totalPhotos === 1) {
        filters.push(`[v0]copy[merged]`);
    } else {
        let currentLabel = "v0";
        for (let i = 1; i < totalPhotos; i++) {
            const offset =
                i * preset.photoDuration - (i * preset.transitionDuration);
            const outLabel = i === totalPhotos - 1 ? "merged" : `m${i}`;
            filters.push(
                `[${currentLabel}][v${i}]xfade=transition=${preset.transition}:` +
                `duration=${preset.transitionDuration}:offset=${offset.toFixed(2)}[${outLabel}]`,
            );
            currentLabel = outLabel;
        }
    }

    // Step 3: Color grading
    if (preset.colorGrading) {
        filters.push(`[merged]${preset.colorGrading}[graded]`);
    } else {
        filters.push(`[merged]copy[graded]`);
    }

    // Step 4: Text overlays
    let lastLabel = "graded";
    textOverlays.forEach((overlay, i) => {
        const outLabel = i === textOverlays.length - 1 ? "textout" : `t${i}`;
        const yPos =
            overlay.position === "center"
                ? "(h-text_h)/2"
                : overlay.position === "top"
                    ? "h*0.1"
                    : "h*0.85";

        // Escape special characters for FFmpeg drawtext
        const escapedText = overlay.text
            .replace(/'/g, "\\'")
            .replace(/:/g, "\\:")
            .replace(/\n/g, "");

        filters.push(
            `[${lastLabel}]drawtext=text='${escapedText}':` +
            `fontsize=${overlay.fontSize}:fontcolor=${overlay.color}:` +
            `x=(w-text_w)/2:y=${yPos}:` +
            `enable='between(t,${overlay.startTime},${overlay.endTime})'[${outLabel}]`,
        );
        lastLabel = outLabel;
    });

    if (textOverlays.length === 0) {
        filters.push(`[graded]copy[textout]`);
    }

    // Step 5: Watermark (free tier)
    if (watermark) {
        filters.push(
            `[textout]drawtext=text='${watermark}':fontsize=20:fontcolor=white@0.4:` +
            `x=w-tw-20:y=h-th-20[final]`,
        );
    } else {
        filters.push(`[textout]copy[final]`);
    }

    // Step 6: Audio handling
    if (musicPath) {
        const totalDuration =
            totalPhotos * preset.photoDuration -
            (totalPhotos - 1) * preset.transitionDuration;
        const audioIdx = totalPhotos;
        filters.push(
            `[${audioIdx}:a]atrim=0:${totalDuration},afade=t=in:d=2,` +
            `afade=t=out:st=${totalDuration - 2}:d=2[aout]`,
        );
    }

    args.push("-filter_complex", filters.join(";"));

    // Output mapping
    args.push("-map", "[final]");
    if (musicPath) {
        args.push("-map", "[aout]");
    }

    // Encoding settings
    args.push(
        "-c:v",
        "libx264",
        "-preset",
        encodingPreset,
        "-crf",
        String(crf),
        "-pix_fmt",
        "yuv420p",
    );

    if (musicPath) {
        args.push("-c:a", "aac", "-b:a", "192k", "-ar", "44100");
    }

    // FastStart for web playback
    args.push("-movflags", "+faststart");

    // Shortest (stop when video ends even if audio is longer)
    if (musicPath) {
        args.push("-shortest");
    }

    args.push("-y", outputPath);

    return args;
}

/**
 * Calculate the total video duration based on photos and preset.
 */
export function calculateTotalDuration(
    numPhotos: number,
    preset: VideoPreset,
): number {
    return (
        numPhotos * preset.photoDuration -
        (numPhotos - 1) * preset.transitionDuration
    );
}

/**
 * Get encoding config based on target resolution.
 */
export function getEncodingConfig(resolution: string): {
    width: number;
    height: number;
    crf: number;
    preset: string;
} {
    switch (resolution) {
        case "4k":
            return { width: 3840, height: 2160, crf: 20, preset: "slow" };
        case "1080p":
            return { width: 1920, height: 1080, crf: 22, preset: "medium" };
        case "720p":
        default:
            return { width: 1280, height: 720, crf: 26, preset: "fast" };
    }
}
