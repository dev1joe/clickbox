import type { TemperatureCache } from "../cache/temperature.cache";
import { OSEMTempSensors } from "../data";
import { Sensor } from "../types";

export type FetchTemperature = (sensors: Sensor[]) => Promise<number>;

export function createTemperatureService(
  fetchTemperature: FetchTemperature,
  cache: TemperatureCache,
) {
  return {
    /** Fetch fresh data and overwrite the cache. Used by the scheduled job. */
    async refresh(): Promise<number> {
      const data = await fetchTemperature(OSEMTempSensors);
      await cache.set(data);
      return data;
    },

    /** Cache-first read. Falls back to a live fetch on a miss. */
    async get(): Promise<number> {
      const cached = await cache.get();
      return cached ?? this.refresh();
    },
  };
}

export type TemperatureService = ReturnType<typeof createTemperatureService>;
