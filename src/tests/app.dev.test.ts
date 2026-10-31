// app.dev.test.ts
// tests app behavior in dev environment
import { it, expect, vi } from "vitest";
import request from "supertest";

it("works with development logging", async () => {
  vi.stubEnv("NODE_ENV", "development");
  vi.resetModules();
  const { createApp } = await import("../app");
  const { createContainer } = await import("../container")

  const container = createContainer()
  const app = createApp(container)

  const res = await request(app).get("/api/version");
  expect(res.status).toBe(200);
});
