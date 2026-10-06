import "server-only";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

/**
 * Shared MySQL pool. Cached on globalThis so dev hot-reloads and serverless
 * warm invocations don't open a new pool every time.
 */
const globalForDb = globalThis as unknown as { __triaxisPool?: mysql.Pool };

function createPool() {
  const required = ["MYSQL_HOST", "MYSQL_DATABASE", "MYSQL_USER", "MYSQL_PASSWORD"] as const;
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing environment variable ${key}`);
  }
  return mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 5),
    waitForConnections: true,
    timezone: "Z",
    dateStrings: ["DATE"],
    charset: "utf8mb4",
  });
}

const pool = globalForDb.__triaxisPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForDb.__triaxisPool = pool;

export const db = drizzle(pool, { schema, mode: "default" });
export { schema };
