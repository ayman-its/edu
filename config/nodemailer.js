import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables if not already loaded
if (!process.env.SMTP_USER && !process.env.GMAIL_AUTH_USER) {
  dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
}

// Get credentials - support both SMTP_* and GMAIL_* for backward compatibility
const user = process.env.SMTP_USER || process.env.GMAIL_AUTH_USER;
const pass = process.env.SMTP_PASS || process.env.GMAIL_AUTH_PASS;
const host = process.env.SMTP_HOST || "smtp.office365.com";
const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;

// Create transporter for Outlook/Office 365 (GoDaddy-managed)
export const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: false, // true only for port 465
  auth: {
    user: user?.trim() || "",
    pass: pass?.trim() || "",
  },
  tls: {
    rejectUnauthorized: false, // helps with Outlook / GoDaddy
  },
});
