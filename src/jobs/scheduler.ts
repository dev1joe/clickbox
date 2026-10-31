import cron from "node-cron";

export interface Job {
  name: string;
  schedule: string;
  run: () => Promise<void>;
}

export function startJobs(jobs: Job[]): { stop: () => void } {
  const tasks = jobs.map((job) => {
    let running = false;

    const execute = async () => {
      if (running) {
        console.warn(`[job:${job.name}] previous run still in progress, skipping`);
        return;
      }
      running = true;
      try {
        await job.run();
        console.log(`[job:${job.name}] done`);
      } catch (err) {
        // A failing job must never take the process down.
        console.error(`[job:${job.name}] failed:`, err);
      } finally {
        running = false;
      }
    };

    void execute(); // also run once at startup so the cache isn't empty for 5 minutes
    return cron.schedule(job.schedule, execute);
  });

  return { stop: () => tasks.forEach((task) => task.stop()) };
}
