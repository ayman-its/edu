import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { resend } from "./resend.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

async function main() {
  console.log("==================================================");
  console.log("Resend Connection Test");
  console.log("==================================================\n");

  // 1. Check API key
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
    console.error("❌ RESEND_API_KEY is not set in .env");
    console.error("   Get your API key at: https://resend.com/api-keys");
    process.exit(1);
  }
  console.log("✅ RESEND_API_KEY is set");
  console.log("   Key prefix:", apiKey.substring(0, 7) + "..." + apiKey.slice(-4));

  // 2. Check from address
  const fromAddress = process.env.RESEND_FROM || "order@hspportal.com";
  console.log("✅ RESEND_FROM:", fromAddress);


  // 3. Send test email
  console.log("\n--- Sending test email ---");
  const toAddress = process.env.RESEND_TEST_TO || "m.ayman2898@gmail.com";
  console.log("   To:", toAddress);

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      subject: "Resend connection test - service request - طلب خدمة",
      html: `
        <h2>Resend connection test</h2>
        <p>If you receive this email, Resend is configured correctly.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    });

    if (error) {
      console.error("\n❌ Resend API error:", error.message);
      if (error.message?.includes("domain")) {
        console.error("   Tip: Verify your domain in Resend dashboard or use onboarding@resend.dev for testing");
      }
      process.exit(1);
    }

    console.log("\n✅ Email sent successfully!");
    console.log("   Email ID:", data?.id || "N/A");
    console.log("\n==================================================");
    console.log("Resend connection test passed.");
    console.log("==================================================");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Unexpected error:", err.message);
    if (process.env.NODE_ENV === "development") {
      console.error(err);
    }
    process.exit(1);
  }
}

main();

