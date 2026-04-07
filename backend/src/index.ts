import compression from "compression";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import corsConfig from "./config/cors.config";
import { envConfig } from "./config/env.config";
import { sendError, sendSuccess } from "./config/sender.config";
import { VerifyAdminApiKeyMiddleware } from "./middleware/auth.middleware";
import {
  HealthCheckRoute,
  helmetConfig,
  PageNotFound,
} from "./middleware/common.middleware";
import { performanceLogger } from "./middleware/logger.middleware";
import rootRoute from "./routes/root.route";

if (process.env.NODE_ENV !== "production") dotenv.config();

const app = express();
app.use(helmetConfig());
app.use(cookieParser());
app.use(corsConfig);
app.use(express.static("public"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// logger
app.use(performanceLogger);

// Root Route version 1
app.use("/api/v1", VerifyAdminApiKeyMiddleware, rootRoute);

// server started route
app.get("/", (req, res) => sendSuccess(res, "Server is live"));

// Health check
app.get("/health", HealthCheckRoute());

// Page not found route
app.use(PageNotFound());

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  return sendError(res, "Internal server error", 500);
});

app.listen(envConfig("PORT"), async () => {
  console.log(`🚀 Server is live on http://localhost:${envConfig("PORT")}`);
});
