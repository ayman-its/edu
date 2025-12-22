// prisma/seed.instructors.js
import fs from "fs/promises";
import path from "path";
import prisma from "../config/prisma.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// TODO: set the local paths to the two images you attached
const photoPathMahmoud =
  "C:/Users/ITS/Desktop/frontend-of-elmanase/edu/UOGvWSlD4odWCUCO-2823689270.jpg"; // first image
const photoPathKhaled =
  "C:/Users/ITS/Desktop/frontend-of-elmanase/edu/March-15-A-Guide-to-Effective-Teaching-Styles_web-1129113266.jpg"; // second image

async function uploadLocal(filePath, folder) {
  const data = await fs.readFile(filePath);
  const res = await cloudinary.uploader.upload_stream(
    { folder, resource_type: "image" },
    (err, result) => {
      if (err) throw err;
      return result;
    }
  );

  // Since upload_stream returns via callback, wrap in a Promise:
  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(data);
  });
}

async function main() {
  // Check if instructors already exist
  const existingMahmoud = await prisma.instructor.findFirst({
    where: { email: "ahmed_esm@gmail.com" },
  });
  const existingKhaled = await prisma.instructor.findFirst({
    where: { email: "mo_esm@gmail.com" },
  });

  let mahmoud, khaled;

  // Create or update Mahmoud
  if (existingMahmoud) {
    console.log("Instructor محمود مصطفى already exists, skipping creation.");
    mahmoud = existingMahmoud;
  } else {
    console.log("Uploading photo for محمود مصطفى...");
    const mahmoudImg = await uploadLocal(photoPathMahmoud, "edu/instructors");
    mahmoud = await prisma.instructor.create({
      data: {
        name: "محمود مصطفى",
        email: "ahmed_esm@gmail.com",
        bio: "محاضر في الجامعة الأمريكية وحاصل على دكتوراة في تعليم اللغات والصوتيات",
        photoUrl: mahmoudImg.secure_url,
      },
    });
    console.log("Created instructor: محمود مصطفى");
  }

  // Create or update Khaled
  if (existingKhaled) {
    console.log("Instructor خالد فؤاد already exists, skipping creation.");
    khaled = existingKhaled;
  } else {
    console.log("Uploading photo for خالد فؤاد...");
    const khaledImg = await uploadLocal(photoPathKhaled, "edu/instructors");
    khaled = await prisma.instructor.create({
      data: {
        name: "خالد فؤاد",
        email: "mo_esm@gmail.com",
        bio: "دكتور مساعد بجامعة bue حاصل على ماجيستير في علم النفس والطب النفسي",
        photoUrl: khaledImg.secure_url,
      },
    });
    console.log("Created instructor: خالد فؤاد");
  }

  console.log("Seed done: instructors ready.");
  console.log(`Mahmoud ID: ${mahmoud.id}`);
  console.log(`Khaled ID: ${khaled.id}`);
  return;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
