"use server";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const ENDPOINT = process.env.ARVAN_ENDPOINT!;
const ACCESS_KEY = process.env.ARVAN_ACCESS_KEY!;
const SECRET_KEY = process.env.ARVAN_SECRET_KEY!;
const BUCKET = process.env.ARVAN_BUCKET!;

if (!ENDPOINT || !ACCESS_KEY || !SECRET_KEY || !BUCKET) {
  throw new Error(
    "Arvan S3 config is missing! Please set ARVAN_ENDPOINT, ARVAN_ACCESS_KEY, ARVAN_SECRET_KEY, ARVAN_BUCKET in your environment variables."
  );
}

const s3 = new S3Client({
  endpoint: ENDPOINT,
  region: "ir-thr-at1",
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
  forcePathStyle: true,
});

const S3_FOLDER = "rich-editor";

function getPublicUrl(key: string): string {
  return `${ENDPOINT}/${BUCKET}/${key}`;
}

/**
 * Upload file to Arvan S3 storage.
 * Returns an object with `secure_url` for backward compatibility with all callers.
 */
export const uploadFile = async (
  data: FormData
): Promise<{ secure_url: string } | undefined> => {
  const file = data.get("file");

  if (!file) throw new Error("No file provided in FormData.");

  let buffer: Buffer;
  let mimeType: string = "application/octet-stream";
  let originalName: string = "upload";

  if (file instanceof Blob) {
    buffer = Buffer.from(await file.arrayBuffer());
    mimeType = file.type || mimeType;
    originalName = (file as File).name || originalName;
  } else if (Buffer.isBuffer(file)) {
    buffer = file;
  } else {
    throw new Error("Uploaded file is invalid. Must be Blob or Buffer.");
  }

  const ext = originalName.includes(".") ? originalName.split(".").pop() : "";
  const key = `${S3_FOLDER}/${randomUUID()}${ext ? "." + ext : ""}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: "public-read" as any,
    })
  );

  return { secure_url: getPublicUrl(key) };
};

/**
 * List all images from the S3 folder.
 */
export const readAllImages = async (): Promise<string[]> => {
  try {
    const response = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: S3_FOLDER + "/",
      })
    );

    return (response.Contents ?? [])
      .filter((obj) => obj.Key && obj.Key !== S3_FOLDER + "/")
      .map((obj) => getPublicUrl(obj.Key!));
  } catch (error) {
    console.error("Error listing images from S3:", error);
    return [];
  }
};

/**
 * Delete an object from S3.
 * Accepts either a full URL or a raw S3 key.
 */
export const removeImage = async (id: string) => {
  try {
    // If a full URL is passed, extract the key portion after the bucket name
    let key = id;
    const bucketPrefix = `${ENDPOINT}/${BUCKET}/`;
    if (id.startsWith(bucketPrefix)) {
      key = id.slice(bucketPrefix.length);
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );
  } catch (error) {
    console.error("Error removing image from S3:", error);
  }
};
