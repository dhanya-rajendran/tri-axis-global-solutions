import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: process.env.ENV_FILE ?? ".env.local" });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.MYSQL_HOST!,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: process.env.MYSQL_DATABASE!,
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
  },
  strict: true,
  verbose: true,
});
