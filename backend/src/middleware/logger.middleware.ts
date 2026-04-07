import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

chalk.level = 3;
const SLOW_THRESHOLD_MS = 500;
const LOG_TO_FILE = true;

interface PerformanceLog {
  method: string;
  route: string;
  statusCode: number;
  durationMs: number;
  ip: string;
  memDeltaMB: number;
  resSizeBytes: number;
  isSlow: boolean;
  query?: Record<string, any>;
}

const getMemoryMB = () => process.memoryUsage().heapUsed / 1024 / 1024;
const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

const formatLog = (log: PerformanceLog): string => {
  const {
    method,
    route,
    statusCode,
    durationMs,
    ip,
    memDeltaMB,
    resSizeBytes,
    isSlow,
  } = log;

  // Method colors
  const methodColor =
    method === "GET"
      ? chalk.green(method)
      : method === "POST"
        ? chalk.blue(method)
        : method === "PUT"
          ? chalk.yellow(method)
          : method === "DELETE"
            ? chalk.red(method)
            : chalk.white(method);

  // Status colors
  const statusColor =
    statusCode >= 500
      ? chalk.bgRed.white(` ${statusCode} `)
      : statusCode >= 400
        ? chalk.red(statusCode)
        : statusCode >= 300
          ? chalk.yellow(statusCode)
          : chalk.green(statusCode);

  // Duration colors
  const durationColor = isSlow
    ? chalk.bgRed.white(` ${durationMs}ms `)
    : durationMs > 200
      ? chalk.yellow(`${durationMs}ms`)
      : chalk.green(`${durationMs}ms`);

  // Memory
  const memColor =
    memDeltaMB > 0
      ? chalk.red(`+${memDeltaMB}MB`)
      : chalk.green(`${memDeltaMB}MB`);

  // Size
  const formattedSize = formatBytes(resSizeBytes);
  const sizeColor =
    resSizeBytes > 1024 * 1024
      ? chalk.red(formattedSize)
      : resSizeBytes > 50 * 1024
        ? chalk.yellow(formattedSize)
        : chalk.gray(formattedSize);
  return (
    `${methodColor} ${statusColor} | ` +
    `${chalk.magenta(ip)} | ` +
    `${chalk.cyan(route || "/")} | ` +
    `${durationColor} | ` +
    `mem: ${memColor} | ` +
    `size: ${sizeColor}`
  );
};

const writeQueue: string[] = [];
let writeScheduled = false;

const writeToFile = (log: PerformanceLog) => {
  writeQueue.push(JSON.stringify(log) + "\n");
  if (!writeScheduled) {
    writeScheduled = true;
  }
};

export const performanceLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startHr = process.hrtime();
  const memBefore = getMemoryMB();
  let resSizeBytes = 0;

  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);

  res.write = function (chunk: any, ...args: any[]): boolean {
    if (chunk) {
      resSizeBytes += Buffer.isBuffer(chunk)
        ? chunk.length
        : Buffer.byteLength(chunk, "utf8");
    }
    return originalWrite(chunk, ...args);
  };

  res.end = function (chunk: any, ...args: any[]): Response {
    if (chunk) {
      resSizeBytes += Buffer.isBuffer(chunk)
        ? chunk.length
        : Buffer.byteLength(chunk, "utf8");
    }
    return originalEnd(chunk, ...args);
  };

  res.on("finish", () => {
    const [sec, ns] = process.hrtime(startHr);
    const durationMs = sec * 1000 + Math.round(ns / 1_000_000);

    const memDelta = parseFloat((getMemoryMB() - memBefore).toFixed(2));
    const isSlow = durationMs > SLOW_THRESHOLD_MS;
    const ip = req.socket?.remoteAddress || req.ip || "unknown";

    const log: PerformanceLog = {
      method: req.method,
      route: req.originalUrl?.split("/api/v1/zerodha")?.[1] ?? req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      memDeltaMB: memDelta,
      ip,
      resSizeBytes,
      isSlow,
      query: Object.keys(req.query).length ? (req.query as any) : undefined,
    };

    isSlow ? console.warn(formatLog(log)) : console.log(formatLog(log));

    if (LOG_TO_FILE) writeToFile(log);
  });

  next();
};
