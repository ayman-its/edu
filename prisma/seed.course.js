// prisma/seed.courses.js
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

// Base directory where the group folders and photos live
const baseDir = "C:/Users/ITS/Desktop/frontend-of-elmanase/edu";

// Helper to set default price/discount if you leave them undefined
const defPrice = 100;
const defDiscount = 0;

// Groups that should be assigned to Khaled; others go to Mahmoud
const khaledGroups = [
  "دورات التنمية البشرية",
  "كورسات علم النفس والصحة النفسية",
];

// Define your groups and courses with desired values
const groups = [
  {
    name: "كورسات اللغة",
    folder: path.join(baseDir, "كورسات اللغات"),
    courses: [
      {
        title: "general English",
        price: 150,
        discount: 10,
        description: "دورة اللغة الإنجليزية العامة.",
        imageFile: "general English.jpg", // adjust extension
      },
      {
        title: "IELTS",
        price: 180,
        discount: 15,
        description: "إعداد اختبار IELTS.",
        imageFile: "IELTS.jpg",
      },
      {
        title: "TOFEL",
        price: 180,
        discount: 15,
        description: "إعداد اختبار TOEFL.",
        imageFile: "TOFEL.jpg",
      },
      {
        title: "English Training",
        price: 160,
        discount: 10,
        description: "تدريب شامل للغة الإنجليزية.",
        imageFile: "English Traning.jpg",
      },
      {
        title: "Conversation",
        price: 140,
        discount: 5,
        description: "مهارات المحادثة الإنجليزية.",
        imageFile: "Conversation.jpg",
      },
    ],
  },
  {
    name: "كورسات إدارة الأعمال والقيادة",
    folder: path.join(baseDir, "كورسات إدارة الأعمال والقيادة"),
    courses: [
      {
        title: "ريادة الأعمال",
        price: 200,
        discount: 10,
        description: "ريادة الأعمال",
        imageFile: "ريادة أعمال.jpg",
      },
      {
        title: "إدارة المشروعات",
        price: 200,
        discount: 10,
        description: "إدارة المشروعات",
        imageFile: "إدارة المشروعات.jpg",
      },
      {
        title: "مهارات اتخاذ القرار وحل المشكلات",
        price: 180,
        discount: 10,
        description: "مهارات اتخاذ القرار وحل المشكلات",
        imageFile: "حل المشكلات (2).jpg",
      },
      {
        title: "إعداد المديرين",
        price: 190,
        discount: 10,
        description: "إعداد المديرين",
        imageFile: "إعداد المديرين.jpg",
      },
      {
        title: "إعداد القادة",
        price: 190,
        discount: 10,
        description: "إعداد القادة",
        imageFile: "إعداد القادة.jpg",
      },
      {
        title: "مهارات التسويق",
        price: 180,
        discount: 10,
        description: "مهارات التسويق",
        imageFile: "مهارات التسويق.jpg",
      },
      {
        title: "مهارات التفاوض",
        price: 180,
        discount: 10,
        description: "مهارات التفاوض",
        imageFile: "مهارات التفاوض.jpg",
      },
      {
        title: "التخطيط الاستراتيجي",
        price: 200,
        discount: 15,
        description: "التخطيط الاستراتيجي",
        imageFile: "التخطيط الاستراتيجي.jpg",
      },
      {
        title: "HR",
        price: 190,
        discount: 10,
        description: "الموارد البشرية",
        imageFile: "HR.jpg",
      },
      {
        title: "القيادة الفعالة",
        price: 190,
        discount: 10,
        description: "القيادة الفعالة",
        imageFile: "القيادة الفعالة.jpg",
      },
      {
        title: "الحوكمة الرشيدة",
        price: 200,
        discount: 15,
        description: "الحوكمة الرشيدة",
        imageFile: "الحوكمة الرشيدة.jpg",
      },
      {
        title: "كتابة التقارير والمكاتبات الرسمية",
        price: 170,
        discount: 10,
        description: "كتابة التقارير والمكاتبات الرسمية",
        imageFile: "كتابة التقارير والمكاتبات الرسمية.jpg",
      },
      {
        title: "إدارة الموارد البشرية",
        price: 190,
        discount: 10,
        description: "إدارة الموارد البشرية",
        imageFile: "إدارة الموارد البشرية.jpg",
      },
      {
        title: "دبلومة إدارة الأعمال الرقمية",
        price: 220,
        discount: 15,
        description: "دبلومة إدارة الأعمال الرقمية",
        imageFile: "دبلومة إدارة الأعمال الرقمية.jpg",
      },
    ],
  },
  {
    name: "برامج مهنية وتطويرية",
    folder: path.join(baseDir, "برامج مهنية وتطويرية"),
    courses: [
      {
        title: "إعداد معلم المستقبل",
        price: 180,
        discount: 10,
        description: "إعداد معلم المستقبل",
        imageFile: "إعداد معلم المستقبل.jpg",
      },
      {
        title: "إعداد محاضر رقمي",
        price: 180,
        discount: 10,
        description: "إعداد محاضر رقمي",
        imageFile: "إعداد محاضر رقمي.jpg",
      },
      {
        title: "إعداد باحث علمي محترف",
        price: 200,
        discount: 10,
        description: "إعداد باحث علمي محترف",
        imageFile: "إعداد باحث علمي محترف.jpg",
      },
      {
        title: "إعداد أخصائي نظم معلومات",
        price: 200,
        discount: 10,
        description: "إعداد أخصائي نظم معلومات",
        imageFile: "إعداد أخصائي نظم معلومات.jpg",
      },
      {
        title: "إعداد المدربين",
        price: 180,
        discount: 10,
        description: "إعداد المدربين",
        imageFile: "إعداد المدربين.jpg",
      },
      {
        title: "دورة مهارات التدريس",
        price: 160,
        discount: 10,
        description: "دورة مهارات التدريس",
        imageFile: "دورة مهارات التدريس.jpg",
      },
      {
        title: "دبلومة التحليل الإحصائي",
        price: 220,
        discount: 15,
        description: "دبلومة التحليل الإحصائي",
        imageFile: "دبلومة التحليل الإحصائي.jpg",
      },
      {
        title: "دبلومة الأمن السيبراني",
        price: 240,
        discount: 15,
        description: "دبلومة الأمن السيبراني",
        imageFile: "دبلومة الأمن السيبراني.jpg",
      },
    ],
  },
  {
    name: "دورات التنمية البشرية",
    folder: path.join(baseDir, "دورات التنمية البشرية"),
    courses: [
      {
        title: "Soft Skills",
        price: 150,
        discount: 10,
        description: "Soft Skills",
        imageFile: "Soft Skills.jpg",
      },
      {
        title: "اللغة الإنجليزية",
        price: 150,
        discount: 10,
        description: "اللغة الإنجليزية",
        imageFile: "اللغة الإنجليزية.jpg",
      },
      {
        title: "الذكاء الاصطناعي",
        price: 170,
        discount: 10,
        description: "الذكاء الاصطناعي",
        imageFile: "الذكاء الاصطناعي.jpg",
      },
      {
        title: "إدارة الوقت",
        price: 150,
        discount: 10,
        description: "إدارة الوقت",
        imageFile: "إدارة الوقت.jpg",
      },
      {
        title: "إدارة الغضب والضغوط",
        price: 160,
        discount: 10,
        description: "إدارة الغضب والضغوط",
        imageFile: "إدارة الغضب والضغوط.jpg",
      },
      {
        title: "القيادة الشبابية",
        price: 170,
        discount: 10,
        description: "القيادة الشبابية",
        imageFile: "القيادة الشبابية.jpg",
      },
      {
        title: "TOT",
        price: 160,
        discount: 10,
        description: "TOT",
        imageFile: "TOT.jpg",
      },
      {
        title: "المهارات الحياتية",
        price: 150,
        discount: 10,
        description: "المهارات الحياتية",
        imageFile: "المهارات الحياتية.jpg",
      },
    ],
  },
  {
    name: "كورسات علم النفس والصحة النفسية",
    folder: path.join(baseDir, "كورسات علم النفس والصحة النفسية"),
    courses: [
      {
        title: "دبلومة التخاطب الخاصة",
        price: 220,
        discount: 15,
        description: "دبلومة التخاطب الخاصة",
        imageFile: "دبلومة التخاطب الخاصة.jpg",
      },
      {
        title: "دبلومة صعوبات التعلم",
        price: 220,
        discount: 15,
        description: "دبلومة صعوبات التعلم",
        imageFile: "دبلومة صعوبات التعلم.jpg",
      },
      {
        title: "دبلومة تعديل السلوك",
        price: 210,
        discount: 15,
        description: "دبلومة تعديل السلوك",
        imageFile: "دبلومة تعديل السلوك.jpg",
      },
      {
        title: "دبلومة طيف التوحد",
        price: 230,
        discount: 15,
        description: "دبلومة طيف التوحد",
        imageFile: "دبلومة طيف التوحد.jpg",
      },
      {
        title: "دبلومة الإعاقات",
        price: 210,
        discount: 15,
        description: "دبلومة الإعاقات",
        imageFile: "دبلومة الإعاقات.jpg",
      },
      {
        title: "دبلومة تنمية المهارات",
        price: 200,
        discount: 15,
        description: "دبلومة تنمية المهارات",
        imageFile: "دبلومة تنمية المهارات.jpg",
      },
      {
        title: "دبلومة الإرشاد الأسري والزواجي",
        price: 230,
        discount: 15,
        description: "دبلومة الإرشاد الأسري والزواجي",
        imageFile: "دبلومة الإرشاد الأسري والزواجي.jpg",
      },
      {
        title: "دبلومة الصحة النفسية",
        price: 230,
        discount: 15,
        description: "دبلومة الصحة النفسية",
        imageFile: "دبلومة الصحة النفسية.jpg",
      },
      {
        title: "دبلومة علم النفس التكاملية",
        price: 240,
        discount: 15,
        description: "دبلومة علم النفس التكاملية",
        imageFile: "دبلومة علم النفس التكاملية.jpg",
      },
      {
        title: "المقاييس والاختبارات النفسية",
        price: 200,
        discount: 10,
        description: "المقاييس والاختبارات النفسية",
        imageFile: "المقاييس والاختبارات النفسية.jpg",
      },
    ],
  },
];

async function uploadImage(filePath, folder) {
  const res = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
  });
  return { url: res.secure_url };
}

// Try to resolve an image path regardless of extension (jpg/png/jpeg/webp)
const normalizeBase = (name) => name.toLowerCase().replace(/\s+/g, "");
async function resolveImagePath(folder, baseName) {
  const exts = [".jpg", ".jpeg", ".png", ".webp"];
  const variants = [baseName, baseName.replace(/\s+/g, "")];
  for (const ext of exts) {
    for (const v of variants) {
      const candidate = path.join(folder, v + ext);
      try {
        await fs.access(candidate);
        return candidate;
      } catch (_) {
        /* keep trying */
      }
    }
  }
  // fallback: scan directory and match filename (sans extension) case-insensitively
  const files = await fs.readdir(folder);
  const normalized = normalizeBase(baseName);
  for (const f of files) {
    const nameNoExt = normalizeBase(f.replace(/\.[^/.]+$/, ""));
    if (nameNoExt === normalized) {
      return path.join(folder, f);
    }
  }
  // looser fallback: choose first file whose normalized name contains the target or vice versa
  for (const f of files) {
    const nameNoExt = normalizeBase(f.replace(/\.[^/.]+$/, ""));
    if (nameNoExt.includes(normalized) || normalized.includes(nameNoExt)) {
      return path.join(folder, f);
    }
  }
  throw new Error(`Image not found for "${baseName}" in ${folder}`);
}

const stripExt = (filename) => filename.replace(/\.[^/.]+$/, "");

// Direct instructor IDs (from seed.instructor.js output)
const mahmoudId = "cmjgpibm30000ocwko1qrv940";
const khaledId = "cmjgpicum0001ocwkd138oif0";

async function main() {
  let groupsCreated = 0;
  let groupsSkipped = 0;
  let coursesCreated = 0;
  let coursesSkipped = 0;

  for (const g of groups) {
    const instructorId = khaledGroups.includes(g.name) ? khaledId : mahmoudId;

    // Check if group already exists
    let group = await prisma.courseGroup.findFirst({
      where: { title: g.name },
    });

    if (group) {
      console.log(`Group "${g.name}" already exists, using existing group.`);
      groupsSkipped++;
      // Ensure the group has the correct instructorId
      if (group.instructorId !== instructorId) {
        console.log(
          `Updating instructor for group "${g.name}" to match expected instructor.`
        );
        group = await prisma.courseGroup.update({
          where: { id: group.id },
          data: { instructorId },
        });
      }
    } else {
      group = await prisma.courseGroup.create({
        data: { title: g.name, instructorId },
      });
      console.log(`Created group: "${g.name}"`);
      groupsCreated++;
    }

    for (const c of g.courses) {
      // Check if course already exists in this group
      const existingCourse = await prisma.course.findFirst({
        where: {
          title: c.title,
          groupId: group.id,
        },
      });

      if (existingCourse) {
        console.log(
          `Course "${c.title}" already exists in group "${g.name}", skipping.`
        );
        coursesSkipped++;
        continue;
      }

      // prefer provided imageFile name (sans extension); else use title
      const baseName = c.imageFile ? stripExt(c.imageFile) : stripExt(c.title);
      let url = null;
      try {
        const filePath = await resolveImagePath(g.folder, baseName);
        const uploaded = await uploadImage(filePath, `edu/courses/${g.name}`);
        url = uploaded.url;
      } catch (err) {
        // If image not found or upload fails, proceed with null photo
        console.warn(
          `Skipping photo for course "${c.title}" in group "${g.name}": ${err.message}`
        );
      }

      await prisma.course.create({
        data: {
          title: c.title,
          instructorId: instructorId,
          coursePhotoUrl: url ?? null,
          description: c.description ?? null,
          price: c.price ?? defPrice,
          discount: c.discount ?? defDiscount,
          groupId: group.id,
        },
      });
      coursesCreated++;
      console.log(`Created course: "${c.title}" in group "${g.name}"`);
    }
  }

  console.log("\n=== Seed Summary ===");
  console.log(`Groups created: ${groupsCreated}`);
  console.log(`Groups skipped (already exist): ${groupsSkipped}`);
  console.log(`Courses created: ${coursesCreated}`);
  console.log(`Courses skipped (already exist): ${coursesSkipped}`);
  console.log(
    "\nSeed completed: courses inserted with price, discount, description, and photos."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
