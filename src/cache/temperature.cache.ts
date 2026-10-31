import type Redis from "ioredis";

const KEY = "temperature:latest";

export interface TemperatureCache {
  get(): Promise<number | null>;
  set(data: number): Promise<void>;
}

export function createTemperatureCache(
  client: Redis,
  ttlSeconds: number,
): TemperatureCache {
  return {
    async get() {
      const raw = await client.get(KEY);
      return raw ? (JSON.parse(raw) as number) : null;
    },
    async set(data) {
      await client.set(KEY, JSON.stringify(data), "EX", ttlSeconds);
    },
  };
}
