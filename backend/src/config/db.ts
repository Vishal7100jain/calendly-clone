import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "scheduler_user",
  password: process.env.DB_PASSWORD || "scheduler_pass",
  database: process.env.DB_NAME || "scheduler_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00", // always store/retrieve in UTC
});

export default pool;
