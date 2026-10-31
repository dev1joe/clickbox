import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";

export interface SnapshotStorage {
  ensureBucket(): Promise<void>;
  save(data: number): Promise<string>; // returns the object key
}

function isNotFound(err: unknown): boolean {
  const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
  return e?.name === "NotFound" || e?.$metadata?.httpStatusCode === 404;
}

export function createSnapshotStorage(client: S3Client, bucket: string): SnapshotStorage {
  return {
    async ensureBucket() {
      try {
        await client.send(new HeadBucketCommand({ Bucket: bucket }));
      } catch (err) {
        if (!isNotFound(err)) throw err; // connection/auth errors should surface
        await client.send(new CreateBucketCommand({ Bucket: bucket }));
      }
    },

    async save(data) {
      const now = Date.now().toString();
      const key = `temperature/${now.replace(/:/g, "-")}.json`;
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: JSON.stringify(data),
          ContentType: "application/json",
        }),
      );
      return key;
    },
  };
}
