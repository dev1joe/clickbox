import { createApp } from "./app"
import { env } from "./config/env";
import { createContainer } from "./container";
import { withRetry } from "./infra/retry";
import { createRefreshCacheJob } from "./jobs/refresh-cache";
import { startJobs } from "./jobs/scheduler";
import { createStoreSnapshotJob } from "./jobs/store-snapshot";

const container = createContainer()
await withRetry(() => container.snapshotStorage.ensureBucket());

const app = createApp(container);

const jobs = startJobs([
  createRefreshCacheJob(container.temperatureService, env.cacheSchedule),
  createStoreSnapshotJob(
    container.snapshotService,
    env.storageSchedule,
  ),
]);

const server = app.listen(env.port, () => {
  console.log(`listening on port ${env.port}`);
});

// Graceful shutdown: stop jobs, drain requests, close Valkey.
function shutdown() {
  jobs.stop();
  server.close(async () => {
    await container.close();
    process.exit(0);
  });
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
