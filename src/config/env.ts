function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  env: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),

  cacheUrl: required("CACHE_URL"),
  cacheSchedule: process.env.CACHE_SCHEDULE ?? "*/5 * * * *",
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS ?? 360),

  s3Endpoint: required("S3_ENDPOINT"),
  s3AccessKey: required("S3_ACCESS_KEY"),
  s3SecretKey: required("S3_SECRET_KEY"),
  s3Bucket: required("S3_BUCKET"),
  storageSchedule: process.env.STORAGE_SCHEDULE ?? "*/5 * * * *",
} as const;
