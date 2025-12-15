// config/prisma.js
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the same .env file that testConn.js uses (project root one level up)
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
