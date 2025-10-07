import { Request, Response, NextFunction } from "express";
import { getStatusCode, toHttpError, logger } from "../utils";
import { config } from "../config";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) return next(err);

  const statusCode = getStatusCode(err);
  const isDev = config.isDev;
  const response = toHttpError(err, isDev);

  logger?.error?.(
    {
      err,
      statusCode,
      path: req.path,
      method: req.method,
      userId: (req as any).user?.id,
    },
    "Request error"
  );

  res.status(statusCode).json(response);
};