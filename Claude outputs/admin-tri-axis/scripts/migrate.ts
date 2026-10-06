/**
 * Applies SQL migrations in db/migrations to the configured database.
 * Usage: npm run db:migrate   (reads .env.local, or ENV_FILE=… to override)
 */
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

config({ path: process.env.ENV_FILE ?? ".env.local" });

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    multipleStatements: true,
  });
  console.log(`Migrating ${process.env.MYSQL_DATABASE} on ${process.env.MYSQL_HOST}…`);
  await migrate(drizzle(connection), { migrationsFolder: "./db/migrations" });
  console.log("✓ Migrations applied");
  await connection.end();
}

main().catch((err) => {
  console.error("Migration failed:", err.message ?? err);
  process.exit(1);
});
