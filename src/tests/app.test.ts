import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../app"

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => { });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api", () => {
  it("return ok", async () => {
    const res = await request(app).get("/api");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/^Hello to/)
  });
});

describe("GET /api/info", () => {
  it("return ok", async () => {
    const res = await request(app).get("/api/info");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("app_name");
    expect(res.body).toHaveProperty("version");
    expect(res.body).toHaveProperty("environment");
  });
});

describe("GET /api/version", () => {
  it("return ok", async () => {
    const res = await request(app).get("/api/version");
    expect(res.status).toBe(200);
  });
});


describe("GET /api/metrics", () => {
  it("return ok", async () => {
    const res = await request(app).get("/api/metrics");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/plain/); // should match text/plain
    expect(res.text).toContain("process_cpu")
  });
});

describe("GET /nobe", () => {
  it("return ok", async () => {
    const res = await request(app).get("/nobe");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not Found" });
  });
});
