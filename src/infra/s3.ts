import { S3Client } from "@aws-sdk/client-s3";

interface S3Config {
  endpoint: string;
  accessKey: string;
  secretKey: string;
}

export function createS3Client({ endpoint, accessKey, secretKey }: S3Config): S3Client {
  return new S3Client({
    endpoint,
    region: "us-east-1", // required by the SDK, ignored by most self-hosted stores
    forcePathStyle: true, // http://host/bucket/key instead of http://bucket.host/key
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  });
}
