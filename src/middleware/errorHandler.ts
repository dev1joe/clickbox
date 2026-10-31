import { type NextFunction, type Request, type Response } from "express";
import { HttpError } from "../utils";

export function errorHandler(err: Error, _req: Request, res: Response, next: NextFunction) {
  console.error(err);
  if (res.headersSent) return next(err);

  const status = err instanceof HttpError ? err.status : 500;
  const message = err instanceof HttpError ? err.message : "Internal server error";
  res.status(status).json({ error: message });
}
