import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app";

describe("GET /api/temperature", () => {
  it("returns a plausible temperature", { timeout: 30_000 }, async () => {
    const res = await request(app).get("/api/temperature");

    expect(res.status).toBe(200);

    const value = res.body.latestMeasurements.value;
    expect(value).toBeGreaterThan(-50);
    expect(value).toBeLessThan(60);
  })
});
