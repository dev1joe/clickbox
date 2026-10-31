import type { SnapshotStorage } from "../storage/snapshot.storage";
import type { TemperatureService } from "./temperature.service";

export function createSnapshotService(
  temperatureService: TemperatureService,
  storage: SnapshotStorage,
) {
  return {
    /** Save a copy of the current data to object storage. */
    async store() {
      const data = await temperatureService.get();
      const key = await storage.save(data);
      return { key, data };
    },
  };
}

export type SnapshotService = ReturnType<typeof createSnapshotService>;
