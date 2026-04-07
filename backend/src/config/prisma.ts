import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { envConfig } from "./env.config";

const adapter = new PrismaMariaDb({
  host: envConfig("DB_HOST"),
  user: envConfig("DB_USER"),
  password: envConfig("DB_PASSWORD"),
  database: envConfig("DB_NAME"),
  connectionLimit: 5,
});

const Prisma = new PrismaClient({ adapter });
export { Prisma };
