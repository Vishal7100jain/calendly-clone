import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { sendError } from "../config/sender.config";

// Optional schema keys
interface ValidationSchemas {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}

export function validateData(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) schemas.body.parse(req.body);
      if (schemas.query) schemas.query.parse(req.query);
      if (schemas.params) schemas.params.parse(req.params);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          path: issue.path.join("."),
          message: `${issue.message}`,
        }));

        return sendError(
          res,
          `${errorMessages[0].message}`,
          400,
          errorMessages
        );
      }

      if (error instanceof Error) {
        return sendError(res, error.message);
      }

      return sendError(res, "Unknown validation error");
    }
  };
}
