import type { Job } from "./scheduler";
import type { TemperatureService } from "../services/temperature.service";

export function createRefreshCacheJob(
  service: TemperatureService,
  schedule: string,
): Job {
  return {
    name: "refresh-cache",
    schedule,
    run: async () => {
      await service.refresh();
    },
  };
}
