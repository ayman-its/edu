import { Resend } from "resend";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables if not already loaded
if (!process.env.RESEND_API_KEY) {
  dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
}

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
  console.warn(
    "Warning: RESEND_API_KEY is not set or is empty. Email functionality may not work."
  );
}

export const resend = new Resend(apiKey?.trim() || "");

