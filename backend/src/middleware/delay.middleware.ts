import { Request, Response, NextFunction } from "express";

export async function delayMiddleware(req: Request, res: Response, next: NextFunction) {
  const delayParam = req.query.delay;

  if (!delayParam) return next();

  const delayMs = Number(delayParam);

  if (Number.isNaN(delayMs) || delayMs <= 0) return next();

  await new Promise((resolve) => setTimeout(resolve, delayMs));
  next();
}
