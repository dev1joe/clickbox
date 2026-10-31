// app.errors.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { HttpError } from "../utils";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => { });
});

afterEach(() => {
  vi.restoreAllMocks();
});

vi.mock("../utils", async (orig) => ({
  ...(await orig<typeof import("../utils")>()),
  getAvgTemp: vi.fn(),
}));

import { getAvgTemp } from "../utils";
import { app } from "../app";

describe("error handling through the app", () => {
  it("returns 500 for unknown errors", async () => {
    vi.mocked(getAvgTemp).mockRejectedValueOnce(new Error("boom"));
    const res = await request(app).get("/api/temperature");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });

  it("uses status/message from HttpError", async () => {
    vi.mocked(getAvgTemp).mockRejectedValueOnce(new HttpError(502, "Upstream failed"));
    const res = await request(app).get("/api/temperature");
    expect(res.status).toBe(502);
    expect(res.body).toEqual({ error: "Upstream failed" });
  });
});
