import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") dotenv.config();

// Define the expected environment variables
const requiredEnvVars = [
  "NODE_ENV",
  "PORT",

  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",

  "JWT_SECRET",
  "JWT_EXPIRES_IN",

  "APP_BASE_URL",

  "X_API_KEY",
  "X_API_SECRET",
] as const;

// Ensure all required variables are defined
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

interface IEvnConfig {
  NODE_ENV: string;
  PORT: number;

  DB_HOST: string;
  DB_PORT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  APP_BASE_URL: string;

  X_API_KEY: string;
  X_API_SECRET: string;
}

export const envConfig = (key: keyof IEvnConfig) => {
  const value = process.env[key] || "";
  return value;
};
