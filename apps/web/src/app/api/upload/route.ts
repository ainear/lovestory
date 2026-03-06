import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
    try {
        // Auth check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const projectId = formData.get("projectId") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "Only JPEG, PNG, WebP, GIF allowed" }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
        }

        // Verify required env vars
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error("Upload error: Missing SUPABASE env vars");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Upload to Supabase Storage
        const serviceClient = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        const ext = file.name.split(".").pop() || "jpg";
        const fileName = `${user.id}/${projectId || "general"}/${Date.now()}.${ext}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        // Ensure bucket exists (auto-create if not)
        const { data: buckets } = await serviceClient.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === "photos");
        if (!bucketExists) {
            const { error: createBucketError } = await serviceClient.storage.createBucket("photos", {
                public: true,
                fileSizeLimit: MAX_FILE_SIZE,
                allowedMimeTypes: ALLOWED_TYPES,
            });
            if (createBucketError) {
                console.error("Bucket creation error:", createBucketError);
                return NextResponse.json({ error: `Storage setup failed: ${createBucketError.message}` }, { status: 500 });
            }
        }

        const { error: uploadError } = await serviceClient.storage
            .from("photos")
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = serviceClient.storage
            .from("photos")
            .getPublicUrl(fileName);

        return NextResponse.json({
            url: urlData.publicUrl,
            fileName,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
