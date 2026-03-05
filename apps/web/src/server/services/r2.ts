import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// R2 client singleton
const r2 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

const BUCKET = process.env.R2_BUCKET!;

export interface UploadOptions {
    key: string;
    body: Buffer | Uint8Array | ReadableStream;
    contentType: string;
    metadata?: Record<string, string>;
}

/**
 * Upload file to R2
 */
export async function uploadFile({
    key,
    body,
    contentType,
    metadata,
}: UploadOptions) {
    await r2.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: body,
            ContentType: contentType,
            Metadata: metadata,
        }),
    );

    return {
        key,
        url: `${process.env.R2_PUBLIC_URL}/${key}`,
    };
}

/**
 * Get presigned upload URL (client-side direct upload)
 */
export async function getUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: contentType,
    });

    const url = await getSignedUrl(r2, command, { expiresIn: 3600 });
    return { url, key };
}

/**
 * Get presigned download URL
 */
export async function getDownloadUrl(key: string) {
    const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
    });

    return getSignedUrl(r2, command, { expiresIn: 3600 });
}

/**
 * Delete file from R2
 */
export async function deleteFile(key: string) {
    await r2.send(
        new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: key,
        }),
    );
}

/**
 * List files in a prefix
 */
export async function listFiles(prefix: string) {
    const result = await r2.send(
        new ListObjectsV2Command({
            Bucket: BUCKET,
            Prefix: prefix,
        }),
    );

    return (
        result.Contents?.map((obj) => ({
            key: obj.Key!,
            size: obj.Size!,
            lastModified: obj.LastModified!,
        })) || []
    );
}

/**
 * Generate project storage key
 */
export function projectKey(projectId: string, filename: string) {
    return `projects/${projectId}/${filename}`;
}

/**
 * Generate user upload key
 */
export function userUploadKey(
    userId: string,
    type: "images" | "music",
    filename: string,
) {
    return `users/${userId}/${type}/${filename}`;
}
