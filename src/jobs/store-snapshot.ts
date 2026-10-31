import type { Job } from "./scheduler";
import type { SnapshotService } from "../services/snapshot.service";

export function createStoreSnapshotJob(
  service: SnapshotService,
  schedule: string,
): Job {
  return {
    name: "store-snapshot",
    schedule,
    run: async () => {
      const { key } = await service.store();
      console.log(`[storage] saved ${key}`);
    },
  };
}
