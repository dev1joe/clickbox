// app.dev.test.ts
// tests app behavior in dev environment
import { it, expect, vi } from "vitest";
import request from "supertest";

it("works with development logging", async () => {
  vi.stubEnv("NODE_ENV", "development");
  vi.resetModules();
  const { app } = await import("../app");

  const res = await request(app).get("/api/version");
  expect(res.status).toBe(200);
});
