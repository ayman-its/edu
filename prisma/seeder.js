import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedArticles } from "./articles";
import { seedResearchAbstract } from "./electronic-library";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Initialize Prisma Client with driver adapter
const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data (optional - uncomment if you want to reset)
  // await prisma.academicService.deleteMany();
  // await prisma.academicCategory.deleteMany();
  // await prisma.course.deleteMany();
  // await prisma.courseGroup.deleteMany();

  // ============================================
  // ACADEMIC SERVICES SEEDING
  // ============================================
  // Note: "خدمات الأرشاد الأكاديمي" is the main service title with description:
  // "نرافقك في رحلتك الأكاديمية بخدمات متكاملة تساعدك على إعداد بحثك العلمي بأعلى معايير الجودة والدقة."
  // This is a display/UI concept. The actual categories are stored below.

  // Create 5 categories for academic services
  const academicSubCategories = [
    {
      title: "التخطيط والتهيئة البحثية",
    },
    {
      title: "الدراسات النظرية والإطار المفاهيمي",
    },
    {
      title: "التحليل البحثي وتفسير النتائج",
    },
    {
      title: "الصياغة الأكاديمية والتحرير العلمي",
    },
    {
      title: "المراجعة النهائية والدعم الأكاديمي",
    },
  ];

  const createdCategories = [];
  for (const category of academicSubCategories) {
    // Check if category already exists
    let existingCategory = await prisma.academicCategory.findFirst({
      where: { title: category.title },
    });

    if (!existingCategory) {
      existingCategory = await prisma.academicCategory.create({
        data: category,
      });
    }
    createdCategories.push(existingCategory);
  }

  // Create AcademicService entries for each category
  // Each category gets at least one service card
  const academicServices = [
    {
      title: "خدمات التخطيط والتهيئة البحثية",
      description:
        "نساعدك في وضع خطة بحثية شاملة ومنظمة تضمن نجاح مشروعك البحثي من البداية",
      categoryId: createdCategories[0].id,
    },
    {
      title: "خدمات الدراسات النظرية والإطار المفاهيمي",
      description:
        "نقدم لك دعمًا متخصصًا في بناء الإطار النظري والمفاهيمي لبحثك العلمي",
      categoryId: createdCategories[1].id,
    },
    {
      title: "خدمات التحليل البحثي وتفسير النتائج",
      description:
        "نرافقك في تحليل بياناتك البحثية وتفسير نتائجك بأسلوب علمي دقيق",
      categoryId: createdCategories[2].id,
    },
    {
      title: "خدمات الصياغة الأكاديمية والتحرير العلمي",
      description:
        "نضمن لك صياغة أكاديمية احترافية تلتزم بأعلى معايير الكتابة العلمية",
      categoryId: createdCategories[3].id,
    },
    {
      title: "خدمات المراجعة النهائية والدعم الأكاديمي",
      description:
        "نراجع رسالتك بعناية لضمان خلوها من الأخطاء اللغوية والإملائية، لتظهر بصورة احترافية تليق",
      categoryId: createdCategories[4].id,
    },
  ];

  for (const service of academicServices) {
    // Check if service already exists
    const existingService = await prisma.academicService.findFirst({
      where: {
        title: service.title,
        categoryId: service.categoryId,
      },
    });

    if (!existingService) {
      await prisma.academicService.create({
        data: service,
      });
    }
  }

  console.log("✓ Academic services seeded successfully");

  // ============================================
  // TRAINING COURSES SEEDING
  // ============================================
  // Note: "خدمات التدريب" / "الدورات التدريبية" is the main service title with description:
  // "نرافقك في رحلتك للتعلم بخدمات متكاملة تساعدك على إتقان مهارات جديدة ومتنوعة بأعلى معايير الجودة والدقة."
  // This is a display/UI concept. The actual course groups are stored below.

  // Create course groups
  const courseGroups = [
    {
      title: "كورسات اللغة",
    },
    {
      title: "كورسات إدارة الأعمال والقيادة",
    },
    {
      title: "برامج مهنية وتطويرية",
    },
    {
      title: "دورات التنمية البشرية",
    },
    {
      title: "كورسات علم النفس والصحة النفسية",
    },
  ];

  const createdCourseGroups = [];
  for (const group of courseGroups) {
    // Check if course group already exists
    let existingGroup = await prisma.courseGroup.findFirst({
      where: { title: group.title },
    });

    if (!existingGroup) {
      existingGroup = await prisma.courseGroup.create({
        data: group,
      });
    }
    createdCourseGroups.push(existingGroup);
  }

  // Placeholder values for courses
  const defaultInstructor = "مدرب محترف";
  const defaultPhotoUrl = "/images/course-placeholder.jpg";
  const defaultDescription = "دورة تدريبية شاملة";
  const defaultRating = 0.0;
  const defaultPrice = 100.0;
  const defaultDiscount = 0.0;

  // كورسات اللغة (Language Courses)
  const languageCourses = [
    "General English",
    "IELTS",
    "TOEFL",
    "English Training",
    "Conversation",
  ];

  for (const courseTitle of languageCourses) {
    // Check if course already exists
    const existingCourse = await prisma.course.findFirst({
      where: {
        title: courseTitle,
        groupId: createdCourseGroups[0].id,
      },
    });

    if (!existingCourse) {
      await prisma.course.create({
        data: {
          title: courseTitle,
          instructor: defaultInstructor,
          coursePhotoUrl: defaultPhotoUrl,
          description: defaultDescription,
          rating: defaultRating,
          price: defaultPrice,
          discount: defaultDiscount,
          groupId: createdCourseGroups[0].id,
        },
      });
    }
  }

  // كورسات إدارة الأعمال والقيادة (Business and Leadership Courses)
  const businessCourses = [
    "ريادة الأعمال",
    "إدارة المشروعات",
    "مهارات اتخاذ القرار وحل المشكلات",
    "إعداد المديرين",
    "إعداد القادة",
    "مهارات التسويق",
    "مهارات التفاوض",
    "التخطيط الاستراتيجي",
    "HR",
    "القيادة الفعالة",
    "الحوكمة الرشيدة",
    "كتابة التقارير والمكاتبات الرسمية",
    "إدارة الموارد البشرية",
    "دبلومة إدارة الأعمال الرقمية",
  ];

  for (const courseTitle of businessCourses) {
    // Check if course already exists
    const existingCourse = await prisma.course.findFirst({
      where: {
        title: courseTitle,
        groupId: createdCourseGroups[1].id,
      },
    });

    if (!existingCourse) {
      await prisma.course.create({
        data: {
          title: courseTitle,
          instructor: defaultInstructor,
          coursePhotoUrl: defaultPhotoUrl,
          description: defaultDescription,
          rating: defaultRating,
          price: defaultPrice,
          discount: defaultDiscount,
          groupId: createdCourseGroups[1].id,
        },
      });
    }
  }

  // برامج مهنية وتطويرية (Professional and Development Programs)
  const professionalCourses = [
    "إعداد معلم المستقبل",
    "إعداد محاضر رقمي",
    "إعداد باحث علمي محترف",
    "إعداد أخصائي نظم معلومات",
    "إعداد المدربين",
    "دورة مهارات التدريس",
    "دبلومة التحليل الإحصائي",
    "دبلومة الأمن السيبراني",
  ];

  for (const courseTitle of professionalCourses) {
    // Check if course already exists
    const existingCourse = await prisma.course.findFirst({
      where: {
        title: courseTitle,
        groupId: createdCourseGroups[2].id,
      },
    });

    if (!existingCourse) {
      await prisma.course.create({
        data: {
          title: courseTitle,
          instructor: defaultInstructor,
          coursePhotoUrl: defaultPhotoUrl,
          description: defaultDescription,
          rating: defaultRating,
          price: defaultPrice,
          discount: defaultDiscount,
          groupId: createdCourseGroups[2].id,
        },
      });
    }
  }

  // دورات التنمية البشرية (Human Development Courses)
  const humanDevelopmentCourses = [
    "Soft Skills",
    "اللغة الإنجليزية",
    "الذكاء الاصطناعي",
    "إدارة الوقت",
    "إدارة الغضب والضغوط",
    "القيادة الشبابية",
    "TOT",
    "المهارات الحياتية",
  ];

  for (const courseTitle of humanDevelopmentCourses) {
    // Check if course already exists
    const existingCourse = await prisma.course.findFirst({
      where: {
        title: courseTitle,
        groupId: createdCourseGroups[3].id,
      },
    });

    if (!existingCourse) {
      await prisma.course.create({
        data: {
          title: courseTitle,
          instructor: defaultInstructor,
          coursePhotoUrl: defaultPhotoUrl,
          description: defaultDescription,
          rating: defaultRating,
          price: defaultPrice,
          discount: defaultDiscount,
          groupId: createdCourseGroups[3].id,
        },
      });
    }
  }

  // كورسات علم النفس والصحة النفسية (Psychology and Mental Health Courses)
  const psychologyCourses = [
    "دبلومة التخاطب الخاصة",
    "دبلومة صعوبات التعلم",
    "دبلومة تعديل السلوك",
    "دبلومة طيف التوحد",
    "دبلومة الإعاقات",
    "دبلومة تنمية المهارات",
    "دبلومة الإرشاد الأسري والزواجي",
    "دبلومة الصحة النفسية",
    "دبلومة علم النفس التكاملية",
    "المقاييس والاختبارات النفسية",
  ];

  for (const courseTitle of psychologyCourses) {
    // Check if course already exists
    const existingCourse = await prisma.course.findFirst({
      where: {
        title: courseTitle,
        groupId: createdCourseGroups[4].id,
      },
    });

    if (!existingCourse) {
      await prisma.course.create({
        data: {
          title: courseTitle,
          instructor: defaultInstructor,
          coursePhotoUrl: defaultPhotoUrl,
          description: defaultDescription,
          rating: defaultRating,
          price: defaultPrice,
          discount: defaultDiscount,
          groupId: createdCourseGroups[4].id,
        },
      });
    }
  }

  console.log("✓ Training courses seeded successfully");

  // ============================================
  // FAQ SEEDING
  // ============================================

  // الأسئلة الشائعة (General FAQs)
  const generalFAQs = [
    {
      question:
        "هل المنصة نظامية قانونياً؟ لما سجل تجاري؟ وأوراق رسمية تضمن الالتزام بالخدمات المقدمة؟",
      answer:
        "نعم، المنصة مرخصة ورسمية 100%. لدينا سجل تجاري رسمي وعقد إلكتروني موقع يضمن حقوقك كاملة. يمكنك طلب إرسال السجل التجاري أو العقد في أي وقت.",
      type: "GENERAL",
    },
    {
      question: "هل المنصة موثوقة وموثوقة في التعامل مع العملاء؟",
      answer:
        "نعم، المنصة موثوقة وموثوقة في التعامل مع العملاء. لدينا نظام تحقق من الهوية والمعلومات المقدمة من قبل العملاء لضمان حمايتهم وأمان عمليات الدفع.",
      type: "GENERAL",
    },
    {
      question: "كيف يمكنني التواصل مع فريق الدعم الفني؟",
      answer:
        "يمكنك التواصل معنا عبر البريد الإلكتروني أو من خلال نموذج التواصل الموجود على الموقع. فريقنا متاح على مدار الساعة للإجابة على استفساراتك.",
      type: "GENERAL",
    },
    {
      question: "ما هي طرق الدفع المتاحة على المنصة؟",
      answer:
        "نوفر عدة طرق دفع آمنة ومتعددة تشمل التحويل البنكي، الدفع الإلكتروني، والدفع عند الاستلام في بعض الحالات. جميع المعاملات محمية بأعلى معايير الأمان.",
      type: "GENERAL",
    },
    {
      question: "هل يمكنني إلغاء الطلب بعد تقديمه؟",
      answer:
        "نعم، يمكنك إلغاء الطلب خلال 24 ساعة من تقديمه. بعد ذلك، يخضع الإلغاء لسياسة الاسترجاع الخاصة بكل خدمة. يرجى مراجعة الشروط والأحكام للتفاصيل الكاملة.",
      type: "GENERAL",
    },
    {
      question: "ما هي مدة معالجة الطلبات؟",
      answer:
        "تختلف مدة المعالجة حسب نوع الخدمة المطلوبة. عادة ما يتم الرد على الطلبات خلال 24-48 ساعة، بينما قد تستغرق الخدمات المعقدة وقتاً أطول. سيتم إعلامك بموعد التسليم المتوقع عند تأكيد الطلب.",
      type: "GENERAL",
    },
  ];

  // خدمات الارشاد الأكاديمي (Academic Services FAQs)
  const academicFAQs = [
    {
      question: "ما هي الخدمات الأكاديمية المتاحة على المنصة؟",
      answer:
        "نوفر مجموعة شاملة من الخدمات الأكاديمية تشمل التخطيط والتهيئة البحثية، الدراسات النظرية والإطار المفاهيمي، التحليل البحثي وتفسير النتائج، الصياغة الأكاديمية والتحرير العلمي، والمراجعة النهائية والدعم الأكاديمي.",
      type: "ACADEMIC_SERVICES",
    },
    {
      question: "كم تستغرق عملية إعداد البحث العلمي؟",
      answer:
        "تختلف المدة حسب حجم البحث وتعقيده. عادة ما يستغرق البحث القصير (10-20 صفحة) من أسبوعين إلى شهر، بينما قد يستغرق البحث الأكاديمي الكامل (50+ صفحة) من شهرين إلى ثلاثة أشهر. سيتم تحديد الجدول الزمني بعد مراجعة متطلباتك.",
      type: "ACADEMIC_SERVICES",
    },
    {
      question: "هل يمكنكم المساعدة في كتابة الأطروحة الكاملة؟",
      answer:
        "نعم، نقدم دعمًا كاملاً في كتابة الأطروحات العلمية بجميع أجزائها. نضمن الالتزام بالمعايير الأكاديمية والمنهجية العلمية الصحيحة، مع الحفاظ على أصالة المحتوى وجودته.",
      type: "ACADEMIC_SERVICES",
    },
    {
      question: "ما هي اللغات التي تقدمون فيها الخدمات الأكاديمية؟",
      answer:
        "نقدم خدماتنا باللغتين العربية والإنجليزية. فريقنا متخصص في الكتابة الأكاديمية بكلتا اللغتين ويفهم متطلبات الجامعات والمؤسسات الأكاديمية المختلفة.",
      type: "ACADEMIC_SERVICES",
    },
    {
      question: "هل تضمنون عدم وجود الانتحال العلمي في الأعمال المقدمة؟",
      answer:
        "نعم، نضمن 100% خلو جميع الأعمال من الانتحال العلمي. نستخدم برامج متقدمة للكشف عن الانتحال، ونقدم تقريرًا يثبت أصالة العمل. كما نلتزم بمعايير الاقتباس والمراجع الصحيحة.",
      type: "ACADEMIC_SERVICES",
    },
    {
      question: "هل يمكنني طلب تعديلات على العمل المقدم؟",
      answer:
        "نعم، نقدم فترة مراجعة مجانية تصل إلى 14 يومًا بعد تسليم العمل. يمكنك طلب أي تعديلات أو تحسينات خلال هذه الفترة دون أي تكلفة إضافية. نحن ملتزمون برضاك التام عن الخدمة المقدمة.",
      type: "ACADEMIC_SERVICES",
    },
  ];

  // خدمات التدريب (Training Services FAQs)
  const trainingFAQs = [
    {
      question: "ما هي أنواع الدورات التدريبية المتاحة؟",
      answer:
        "نوفر مجموعة واسعة من الدورات التدريبية تشمل كورسات اللغة (الإنجليزية، IELTS، TOEFL)، كورسات إدارة الأعمال والقيادة، البرامج المهنية والتطويرية، دورات التنمية البشرية، وكورسات علم النفس والصحة النفسية.",
      type: "TRAINING_SERVICES",
    },
    {
      question: "هل الدورات التدريبية متاحة أونلاين أم حضورياً؟",
      answer:
        "نوفر كلا الخيارين. معظم دوراتنا متاحة أونلاين مع إمكانية التسجيل في جلسات مباشرة مع المدربين. كما نقدم دورات حضورية في بعض المناطق. يمكنك اختيار النمط الذي يناسبك.",
      type: "TRAINING_SERVICES",
    },
    {
      question: "هل تحصل على شهادة معتمدة بعد إتمام الدورة؟",
      answer:
        "نعم، تحصل على شهادة إتمام معتمدة بعد إتمام الدورة بنجاح. الشهادات معترف بها ويمكن استخدامها في السيرة الذاتية. بعض الدورات تمنح شهادات معتمدة من جهات دولية.",
      type: "TRAINING_SERVICES",
    },
    {
      question: "كم مدة الدورة التدريبية الواحدة؟",
      answer:
        "تختلف مدة الدورات حسب المحتوى والهدف منها. الدورات القصيرة قد تستغرق من أسبوع إلى شهر، بينما البرامج الشاملة والدبلومات قد تمتد من شهرين إلى ستة أشهر. يتم تحديد المدة مسبقاً في وصف كل دورة.",
      type: "TRAINING_SERVICES",
    },
    {
      question:
        "هل يمكنني الحصول على استرداد المبلغ إذا لم أكن راضياً عن الدورة؟",
      answer:
        "نعم، نقدم ضمان استرداد المبلغ خلال 7 أيام من بداية الدورة إذا لم تكن راضياً عن المحتوى. نحن ملتزمون بتقديم تجربة تعليمية متميزة ونسعى لرضاك التام.",
      type: "TRAINING_SERVICES",
    },
    {
      question: "هل يمكنني الوصول للمحتوى بعد انتهاء الدورة؟",
      answer:
        "نعم، يمكنك الوصول للمحتوى المسجل والمواد التعليمية لمدة 6 أشهر بعد انتهاء الدورة. هذا يتيح لك مراجعة المحتوى في أي وقت وتطبيق ما تعلمته بشكل أفضل.",
      type: "TRAINING_SERVICES",
    },
  ];

  // Create all FAQs
  const allFAQs = [...generalFAQs, ...academicFAQs, ...trainingFAQs];

  for (const faq of allFAQs) {
    // Check if FAQ already exists
    const existingFAQ = await prisma.fAQ.findFirst({
      where: {
        question: faq.question,
        type: faq.type,
      },
    });

    if (!existingFAQ) {
      await prisma.fAQ.create({
        data: faq,
      });
    }
  }

 seedArticles()
  seedResearchAbstract();
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
