/**
 * Script: apps/web/scripts/sync-r2-assets.mjs
 * Purpose: Synchronize 75 template backgrounds and thumbnails to Cloudflare R2
 * Sprint 52: CineLove Parity 90%+ & Self-Hosted Assets
 */

import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

// Resolve directories relative to monorepo root
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const WEB_DIR = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(WEB_DIR, "../..");
const LOCAL_TEMPLATES_DIR = path.join(WEB_DIR, "public/templates");
const DOCS_DIR = path.join(REPO_ROOT, "docs");

async function main() {
  console.log("=================================================");
  console.log("  LoveStory Cloudflare R2 Template Sync Engine   ");
  console.log("=================================================");

  if (!fs.existsSync(LOCAL_TEMPLATES_DIR)) {
    console.error(`❌ Local templates directory not found: ${LOCAL_TEMPLATES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(LOCAL_TEMPLATES_DIR).filter((f) => f.endsWith(".webp"));
  console.log(`📁 Found ${files.length} template assets in local cache.\n`);

  const hasR2Creds = Boolean(
    process.env.R2_ENDPOINT &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET
  );

  let r2Client = null;
  const bucket = process.env.R2_BUCKET || "lovestory-assets";
  const publicUrl = process.env.R2_PUBLIC_URL || "https://assets.7app.online";

  if (hasR2Creds) {
    console.log("⚡ Cloudflare R2 credentials detected. Initializing S3 client...");
    r2Client = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  } else {
    console.log("ℹ️  Running in Local Verification & Cache Mode (R2 env vars optional).");
  }

  const results = [];
  let totalBytes = 0;

  for (const filename of files) {
    const filePath = path.join(LOCAL_TEMPLATES_DIR, filename);
    const stats = fs.statSync(filePath);
    totalBytes += stats.size;
    const r2Key = `templates/long_thumbnail/${filename}`;

    if (r2Client) {
      try {
        let alreadyExists = false;
        try {
          await r2Client.send(
            new HeadObjectCommand({
              Bucket: bucket,
              Key: r2Key,
            })
          );
          alreadyExists = true;
        } catch {
          alreadyExists = false;
        }

        if (alreadyExists) {
          results.push({
            filename,
            sizeBytes: stats.size,
            status: "skipped_already_exists",
            r2Key,
          });
          process.stdout.write("⏩ ");
          continue;
        }

        const fileContent = fs.readFileSync(filePath);
        await r2Client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: r2Key,
            Body: fileContent,
            ContentType: "image/webp",
            CacheControl: "public, max-age=31536000, immutable",
          })
        );

        results.push({
          filename,
          sizeBytes: stats.size,
          status: "uploaded",
          r2Key,
        });
        process.stdout.write("✅ ");
      } catch (err) {
        results.push({
          filename,
          sizeBytes: stats.size,
          status: "failed",
          r2Key,
          error: err?.message || String(err),
        });
        process.stdout.write("❌ ");
      }
    } else {
      results.push({
        filename,
        sizeBytes: stats.size,
        status: "verified_local",
        r2Key,
      });
      process.stdout.write("🔍 ");
    }
  }

  console.log("\n\n-------------------------------------------------");
  console.log(`📊 Total Assets Processed: ${results.length} files`);
  console.log(`📦 Total Size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  
  const uploaded = results.filter((r) => r.status === "uploaded").length;
  const skipped = results.filter((r) => r.status === "skipped_already_exists").length;
  const verified = results.filter((r) => r.status === "verified_local").length;
  const failed = results.filter((r) => r.status === "failed").length;

  console.log(`   - Uploaded to R2: ${uploaded}`);
  console.log(`   - Skipped (Already on R2): ${skipped}`);
  console.log(`   - Verified Local Cache: ${verified}`);
  console.log(`   - Failed: ${failed}`);
  console.log("-------------------------------------------------\n");

  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  const reportPath = path.join(DOCS_DIR, "R2_ASSET_SYNC_REPORT.json");
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        syncedAt: new Date().toISOString(),
        totalFiles: results.length,
        totalSizeMB: Number((totalBytes / (1024 * 1024)).toFixed(2)),
        bucket,
        publicUrl,
        mode: hasR2Creds ? "r2_remote" : "local_verified",
        assets: results,
      },
      null,
      2
    )
  );

  console.log(`📄 Report saved to: ${reportPath}`);
}

main().catch((err) => {
  console.error("Fatal sync error:", err);
  process.exit(1);
});
