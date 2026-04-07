import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config";
import { sendError } from "../config/sender.config";
import { JwtPayload } from "../types/types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    return sendError(res, "Invalid or expired token", 401);
  }
};

export const VerifyAdminApiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"];
  const apiSecret = req.headers["x-api-secret"];

  if (!apiKey || !apiSecret) {
    return sendError(res, "API key and secret are required", 401);
  }

  if (
    envConfig("X_API_KEY") != apiKey ||
    envConfig("X_API_SECRET") != apiSecret
  ) {
    return sendError(res, "Invalid API key or secret", 403);
  }

  next();
};
