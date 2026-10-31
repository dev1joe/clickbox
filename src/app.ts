import express, { type Request, type Response } from "express";
import morgan from "morgan";
import { env } from "./config/env";
import { getTempStatus } from "./utils";
import pkg from "../package.json" with { type: 'json' }
import * as client from "@prometheus-io/client";
import { errorHandler } from "./middleware/errorHandler"
import type { TemperatureService } from "./services/temperature.service";
import type { SnapshotService } from "./services/snapshot.service";

interface AppDeps {
  temperatureService: TemperatureService
  snapshotService: SnapshotService
}

export function createApp({ temperatureService, snapshotService }: AppDeps) {
  const app = express();
  app.disable("X-powered-by");
  const ApiRouter = express.Router();

  ApiRouter.get("/", (_req: Request, res: Response) => {
    res.json({ "message": `Hello to ${pkg.name}` });
  });

  ApiRouter.get("/info", (_req: Request, res: Response) => {
    res.json({
      "app_name": pkg.name,
      "version": pkg.version,
      "environment": env.env,
    });
  });

  ApiRouter.get("/version", (_req: Request, res: Response) => {
    res.json({ "version": pkg.version });
  });

  ApiRouter.get("/temperature", async (_req: Request, res: Response) => {
    // Express 5 catches errors ands sends them to the global error handler so no need to use try-catch blocks
    const avg = await temperatureService.get();
    const status = getTempStatus(avg);

    res.json({ "averageTemperature": avg, status });
  });

  const register = new client.Registry();
  client.collectDefaultMetrics({ register });

  ApiRouter.get("/metrics", async (_req: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics())
  });

  ApiRouter.post("/cache", async (_req, res) => {
    const data = await temperatureService.refresh();
    res.json({ message: "success", data });
  });

  ApiRouter.post("/store", async (_req, res) => {
    const { key } = await snapshotService.store();
    res.status(201).json({ message: "success", data: { key } });
  })

  app.use(morgan(env.env === "development" ? "dev" : "combined"));
  app.use("/api", ApiRouter);

  // catch all unmatched urls
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Error-Handler must be last, and must have all 4 params
  app.use(errorHandler);

  return app;
}
