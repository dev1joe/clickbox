import { env } from "./config/env";
import { createValkeyClient } from "./infra/valkey";
import { createTemperatureCache } from "./cache/temperature.cache";
import { createTemperatureService } from "./services/temperature.service";
import { getAvgTemp } from "./utils";
import { createS3Client } from "./infra/s3";
import { createSnapshotStorage } from "./storage/snapshot.storage";
import { createSnapshotService } from "./services/snapshot.service";

export function createContainer() {
  const valkey = createValkeyClient(env.cacheUrl);
  const cache = createTemperatureCache(valkey, env.cacheTtlSeconds);
  const temperatureService = createTemperatureService(getAvgTemp, cache);

  const s3 = createS3Client({
    endpoint: env.s3Endpoint,
    accessKey: env.s3AccessKey,
    secretKey: env.s3SecretKey,
  });
  const snapshotStorage = createSnapshotStorage(s3, env.s3Bucket);

  const snapshotService = createSnapshotService(temperatureService, snapshotStorage);

  return {
    temperatureService,
    snapshotService,
    snapshotStorage,
    close: async () => {
      await valkey.quit();
      s3.destroy();
    }
  };
}

export type Container = ReturnType<typeof createContainer>;
