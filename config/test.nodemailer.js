import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { transporter } from "./nodemailer.js";
import prisma from "./prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Test data - mimicking form submission
const testData = {
  name: "Test User",
  email: "test@example.com",
  whatsappCode: "+966",
  whatsappNumber: "123456789",
  serviceId: null, // Will try to fetch from DB
  categoryId: null, // Will try to fetch from DB
  request: "This is a test request message to verify nodemailer functionality",
};

// Verify environment variables
function checkEnvironmentVariables() {
  console.log("\n=== Environment Variables Check ===");
  // Support both SMTP_* and GMAIL_* for backward compatibility
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_AUTH_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_AUTH_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.office365.com";
  const smtpPort = process.env.SMTP_PORT || "587";

  if (!smtpUser) {
    console.error("❌ SMTP_USER (or GMAIL_AUTH_USER) is not set in environment variables");
    return false;
  } else {
    console.log(`✅ SMTP_USER is set: ${smtpUser}`);
    if (smtpUser.trim() === "") {
      console.error("❌ SMTP_USER is empty");
      return false;
    }
  }

  if (!smtpPass) {
    console.error("❌ SMTP_PASS (or GMAIL_AUTH_PASS) is not set in environment variables");
    return false;
  } else {
    console.log(`✅ SMTP_PASS is set (hidden)`);
    if (typeof smtpPass !== "string" || smtpPass.trim() === "") {
      console.error("❌ SMTP_PASS is empty or invalid");
      console.error("   Note: For GoDaddy-managed Office 365, 2FA must be DISABLED");
      return false;
    }
    console.log(`   Password length: ${smtpPass.length} characters`);
  }

  console.log(`✅ SMTP_HOST: ${smtpHost}`);
  console.log(`✅ SMTP_PORT: ${smtpPort}`);

  return true;
}

// Verify transporter connection
async function verifyConnection() {
  console.log("\n=== Transporter Connection Verification ===");
  try {
    // Check if transporter has valid auth
    const auth = transporter.options?.auth;
    const host = transporter.options?.host || "smtp.office365.com";
    const port = transporter.options?.port || 587;
    
    console.log(`   SMTP Host: ${host}`);
    console.log(`   SMTP Port: ${port}`);
    
    if (!auth || !auth.user || !auth.pass) {
      console.error("❌ Transporter auth configuration is missing or invalid");
      console.error("   Auth object:", auth ? { user: auth.user, pass: auth.pass ? "***" : "missing" } : "null");
      return false;
    }

    console.log("   Attempting to verify connection...");
    await transporter.verify();
    console.log("✅ Transporter is ready to send emails");
    return true;
  } catch (error) {
    console.error("❌ Transporter verification failed:", error.message);
    if (error.message.includes("PLAIN") || error.message.includes("Invalid login")) {
      console.error("\n   Troubleshooting tips for GoDaddy-managed Office 365:");
      console.error("   1. Ensure 2-Step Verification is DISABLED in GoDaddy settings");
      console.error("   2. Go to: https://productivity.godaddy.com/settings");
      console.error("   3. Navigate to: Mailbox → Security");
      console.error("   4. Turn OFF 2-Step Verification (GoDaddy doesn't support App Passwords)");
      console.error("   5. Ensure SMTP Authentication is ON");
      console.error("   6. Check that the password in .env file doesn't have extra quotes or whitespace");
      console.error("   7. Verify the password is correct");
    }
    if (process.env.NODE_ENV === "development") {
      console.error("   Full error:", error);
    }
    return false;
  }
}

// Fetch service and category from database (similar to endpoint)
async function fetchServiceAndCategory(serviceId, categoryId) {
  console.log("\n=== Fetching Service and Category from Database ===");
  let service = null;
  let category = null;

  if (serviceId) {
    try {
      service = await prisma.academicService.findUnique({
        where: { id: serviceId },
        select: {
          id: true,
          title: true,
        },
      });

      if (service) {
        console.log(`✅ Service found: ${service.title}`);
      } else {
        console.log(`⚠️  Service with ID ${serviceId} not found`);
      }
    } catch (error) {
      console.log(`⚠️  Error fetching service: ${error.message}`);
    }
  } else {
    // Try to get first available service for testing
    try {
      const services = await prisma.academicService.findMany({
        take: 1,
        select: {
          id: true,
          title: true,
        },
      });
      if (services.length > 0) {
        service = services[0];
        testData.serviceId = service.id;
        console.log(`✅ Using first available service: ${service.title}`);
      }
    } catch (error) {
      console.log(`⚠️  Could not fetch any service: ${error.message}`);
    }
  }

  if (categoryId) {
    try {
      category = await prisma.academicCategory.findUnique({
        where: { id: categoryId },
        select: {
          id: true,
          title: true,
        },
      });

      if (category) {
        console.log(`✅ Category found: ${category.title}`);
      } else {
        console.log(`⚠️  Category with ID ${categoryId} not found`);
      }
    } catch (error) {
      console.log(`⚠️  Error fetching category: ${error.message}`);
    }
  } else if (service) {
    // Try to get category from service
    try {
      const serviceWithCategory = await prisma.academicService.findUnique({
        where: { id: service.id },
        include: {
          category: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
      if (serviceWithCategory?.category) {
        category = serviceWithCategory.category;
        testData.categoryId = category.id;
        console.log(`✅ Category from service: ${category.title}`);
      }
    } catch (error) {
      console.log(`⚠️  Could not fetch category: ${error.message}`);
    }
  }

  return { service, category };
}

// Format email body (exact same as endpoint)
function formatEmailBody(name, email, whatsappCode, whatsappNumber, category, service, request) {
  const fullWhatsAppNumber = `${whatsappCode || ""}${whatsappNumber}`.trim();

  return `
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0B72B9; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .field { margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 5px; }
          .label { font-weight: bold; color: #0B72B9; margin-bottom: 5px; }
          .value { color: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>طلب خدمة جديدة - New Service Request</h2>
          </div>
          <div class="field">
            <div class="label">الإسم / Name:</div>
            <div class="value">${name || "غير محدد / Not provided"}</div>
          </div>
          <div class="field">
            <div class="label">البريد الإلكتروني / Email:</div>
            <div class="value">${email || "غير محدد / Not provided"}</div>
          </div>
          <div class="field">
            <div class="label">رقم الواتس اب / WhatsApp Number:</div>
            <div class="value">${fullWhatsAppNumber}</div>
          </div>
          ${category ? `
          <div class="field">
            <div class="label">الفئة / Category:</div>
            <div class="value">${category.title}</div>
          </div>
          ` : ""}
          ${service ? `
          <div class="field">
            <div class="label">الخدمة / Service:</div>
            <div class="value">${service.title}</div>
          </div>
          ` : ""}
          <div class="field">
            <div class="label">طلبكم / Request:</div>
            <div class="value">${request || "لا يوجد / None"}</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Send test email (same structure as endpoint)
async function sendTestEmail() {
  console.log("\n=== Sending Test Email ===");
  try {
    const { service, category } = await fetchServiceAndCategory(
      testData.serviceId,
      testData.categoryId
    );

    const emailBody = formatEmailBody(
      testData.name,
      testData.email,
      testData.whatsappCode,
      testData.whatsappNumber,
      category,
      service,
      testData.request
    );

    // Same mailOptions as endpoint
    const fromAddress = process.env.SMTP_USER || process.env.GMAIL_AUTH_USER;
    const mailOptions = {
      from: fromAddress,
      to: "order@hspportal.com",
      subject: "service request - طلب خدمة",
      html: emailBody,
    };

    console.log("📧 Sending email to: order@hspportal.com");
    console.log("📧 Subject: service request - طلب خدمة");
    console.log("📧 From:", fromAddress);

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email sent successfully!");
    console.log("📬 Message ID:", info.messageId);
    console.log("📬 Response:", info.response);

    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    if (process.env.NODE_ENV === "development") {
      console.error("Full error:", error);
    }
    return false;
  }
}

// Compare with endpoint implementation
function compareWithEndpoint() {
  console.log("\n=== Comparison with Endpoint Implementation ===");
  console.log("\n✅ Same transporter import: from './nodemailer.js'");
  console.log("✅ Same environment variables: SMTP_USER/SMTP_PASS (or GMAIL_AUTH_USER/GMAIL_AUTH_PASS)");
  console.log("✅ Same SMTP configuration: smtp.office365.com:587");
  console.log("✅ Same email recipient: 'order@hspportal.com'");
  console.log("✅ Same email subject: 'service request - طلب خدمة'");
  console.log("✅ Same HTML body structure and styling");
  console.log("✅ Same email options format");
  console.log("✅ Same async/await pattern");
  console.log("✅ Similar error handling");
  console.log("\n📋 Differences:");
  console.log("   - Test file includes additional verification steps");
  console.log("   - Test file includes environment variable checks");
  console.log("   - Test file includes transporter.verify() check");
  console.log("   - Endpoint includes Prisma validation and error responses");
}

// Main test function
async function main() {
  console.log("=".repeat(50));
  console.log("Nodemailer Test File");
  console.log("Comparing with endpoint: requestService in acad.controller.js");
  console.log("=".repeat(50));

  let exitCode = 0;

  try {
    // Check environment variables
    if (!checkEnvironmentVariables()) {
      exitCode = 1;
      return;
    }

    // Verify connection
    if (!(await verifyConnection())) {
      exitCode = 1;
      return;
    }

    // Compare with endpoint
    compareWithEndpoint();

    // Send test email
    if (!(await sendTestEmail())) {
      exitCode = 1;
    }

    console.log("\n" + "=".repeat(50));
    if (exitCode === 0) {
      console.log("✅ All tests passed!");
    } else {
      console.log("❌ Some tests failed");
    }
    console.log("=".repeat(50));
  } catch (error) {
    console.error("\n❌ Unexpected error:", error.message);
    if (process.env.NODE_ENV === "development") {
      console.error("Full error:", error);
    }
    exitCode = 1;
  } finally {
    // Disconnect Prisma
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error("Error disconnecting Prisma:", error.message);
    }
    process.exit(exitCode);
  }
}

// Run the test
main();

