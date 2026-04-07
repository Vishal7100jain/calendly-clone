import { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { sendSuccess } from "../config/sender.config";

export const helmetConfig = () =>
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted.cdn.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'", "api.example.com"],
    },
    reportOnly: true,
  });

export const PageNotFound =
  () => (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Route not found",
      data: null,
    });
  };

export const HealthCheckRoute = () => (req: Request, res: Response) =>
  sendSuccess(res, {
    status: "ok",
    timestamp: new Date().toISOString(),
  });
