import { env, defineConfig } from "@prisma/config";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (parent directory)
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "prisma/seed.acad.services.js",
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL for migrations to avoid connection pooler issues with prepared statements
    url: env("DIRECT_URL") || env("DATABASE_URL"),
  },
});
