import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
];
// Validate by file signature (magic bytes)
function isValidAudioSignature(buffer: Buffer): boolean {
  // MP3: ID3 header or MPEG sync
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) return true; // ID3
  if (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) return true; // MPEG sync
  // MP4/M4A: ftyp box
  if (
    buffer[4] === 0x66 &&
    buffer[5] === 0x74 &&
    buffer[6] === 0x79 &&
    buffer[7] === 0x70
  )
    return true;
  // OGG: OggS
  if (buffer.subarray(0, 4).toString() === "OggS") return true;
  // WAV: RIFF
  if (buffer.subarray(0, 4).toString() === "RIFF") return true;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 5 audio uploads/hour per user
    const rl = checkRateLimit(`upload-audio:${user.id}`, {
      limit: 5,
      windowSec: 3600,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Quá nhiều upload nhạc, vui lòng thử lại sau 1 giờ" },
        { status: 429, headers: { "Retry-After": String(rl.resetIn) } },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Chỉ hỗ trợ file MP3, M4A, WAV, OGG" },
        { status: 400 },
      );
    }

    if (file.size > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        { error: "File quá lớn (tối đa 10MB)" },
        { status: 400 },
      );
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate magic bytes (prevent disguised malware via extension trick)
    if (!isValidAudioSignature(buffer)) {
      return NextResponse.json(
        { error: "File không hợp lệ" },
        { status: 400 },
      );
    }

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Sanitize filename: only allow alphanumeric + dash + dot
    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 80);
    const ext = safeName.includes(".") ? safeName.split(".").pop() : "mp3";
    const fileName = `${user.id}/${projectId || "general"}/${Date.now()}.${ext}`;

    // Ensure audio bucket exists
    const { data: buckets } = await serviceClient.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === "audio");
    if (!bucketExists) {
      await serviceClient.storage.createBucket("audio", {
        public: true,
        fileSizeLimit: MAX_AUDIO_SIZE,
        allowedMimeTypes: ALLOWED_AUDIO_TYPES,
      });
    }

    const { error: uploadError } = await serviceClient.storage
      .from("audio")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Audio upload error:", uploadError);
      return NextResponse.json(
        { error: "Upload thất bại" },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = serviceClient.storage.from("audio").getPublicUrl(fileName);

    return NextResponse.json({
      url: publicUrl,
      name: safeName,
      size: file.size,
    });
  } catch (err) {
    console.error("upload-audio unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
