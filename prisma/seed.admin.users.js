import bcrypt from "bcryptjs";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

async function seedAdminUsers() {
  // Initialize Prisma Client with driver adapter
  const pool = new Pool({ connectionString: process.env.DIRECT_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Starting admin users seeding...");

    const adminEmails = [
      "admin1@hspportal.com",
      "admin2@hspportal.com",
      "admin3@hspportal.com",
    ];
    const password = "P@ssw0rdd";
    const hashedPassword = await bcrypt.hash(password, 10);

    for (const email of adminEmails) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log(`User with email ${email} already exists. Skipping...`);
        continue;
      }

      // Create new admin user
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          isAdmin: true,
          username: email.split("@")[0],
        },
      });

      console.log(`✓ Created admin user: ${email}`);
    }

    console.log("✓ Admin users seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding admin users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAdminUsers();
