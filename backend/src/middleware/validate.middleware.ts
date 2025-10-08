import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { logger } from "../utils/logger";

export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      logger.debug({ body: req.body, url: req.url, method: req.method }, "Validating request");

      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error?.issues?.map(issue => ({
          field: issue.path.join("."),
          message: issue.message
        })) || [{ field: "unknown", message: "Validation failed" }];

        logger.warn({ errors, url: req.url, method: req.method, rawError: result.error }, "Validation failed");

        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors
        });
        return;
      }

      req.body = result.data;
      next();
    } catch (error) {
      logger.error({ err: error, body: req.body, url: req.url, method: req.method }, "Validation middleware error");

      res.status(500).json({
        success: false,
        error: "Internal server error"
      });
      return;
    }
  };
};
