import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { errorHandler } from "../middleware/errorHandler";
import { type Request, type Response } from "express"

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => { });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const fakeReq = {} as unknown as Request;

function fakeRes(overrides: Partial<Response> = {}) {
  const res = {
    headersSent: false,
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    ...overrides,
  };
  return res as unknown as Response;
}

it("delegates to next() when headers are already sent", () => {
  const error = new Error("late");
  const next = vi.fn();

  errorHandler(
    error,
    fakeReq,
    fakeRes({ headersSent: true }),
    next
  );

  expect(next).toHaveBeenCalledWith(error);
});
