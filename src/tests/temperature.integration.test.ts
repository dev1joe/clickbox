import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse, passthrough } from "msw";
import { setupServer } from "msw/node";
import request from "supertest";
import { app } from "../app.ts";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => { });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// passthrough any requests from localhost
const server = setupServer(
  http.all(/^http:\/\/(127\.0\.0\.1|localhost):\d+/, () => passthrough())
);

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const measurement = () => (
  {
    title: "some place",
    unit: "c",
    sensorType: "temperature",
    icon: "icon",
    _id: "id",
    lastMeasurement: {
      createdAt: new Date().toISOString(),
      value: "10",
    }
  }
);

// group of tests
describe("GET /api/temperature", () => {

  // first test
  it("Averages the readings returned by OSEM", async () => {
    // creating handler
    server.use(
      http.get(
        `https://api.opensensemap.org/boxes/:boxId/sensors/:sensorId`,
        () => HttpResponse.json(measurement())
      )
    );

    const res = await request(app).get('/api/temperature');
    // console.log("temp averaging result body");
    // console.log(res.body);
    // console.log("==============================")

    expect(res.status).toBe(200);
    expect(res.body.averageTemperature).toBe(10);
    expect(res.body.status.toLowerCase()).toMatch("good");
  });

  // second test
  it("handles an upstream 500", async () => {
    server.use(
      http.get(
        `https://api.opensensemap.org/boxes/:boxId/sensors/:sensorId`,
        () => HttpResponse.json(null, { status: 500 })
      )
    );

    const res = await request(app).get('/api/temperature');
    // console.error("response body");
    // console.error(res.body);
    // console.log("==============================")

    expect(res.status).toBeGreaterThanOrEqual(500);
  });
})
