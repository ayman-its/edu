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

const baseDir = "C:/Users/ITS/Desktop/frontend-of-elmanase/edu";

const defPrice = 100;
const defDiscount = 0;

const khaledGroups = [
  "دورات التنمية البشرية",
  "دورات علم النفس والصحة النفسية",
];

// Define your groups and courses with desired values
const groups = [
  {
    name: "دورات اللغات",
    folder: path.join(baseDir, "كورسات اللغات"),
    courses: [
      {
        title: "general English",
        price: 150,
        discount: 10,
        description: "دورة اللغة الإنجليزية العامة.",
        courseBenefits:
          "تنمية مهارات القراءة والكتابة والاستماع والمحادثة، تحسين النطق السليم، زيادة الثقة في استخدام اللغة في الحياة اليومية.",
        wayOfTraining:
          "شرح مبسط، تدريبات تطبيقية، أنشطة تفاعلية، محادثات عملية.",
        targetAudience:
          "المبتدئون في تعلم اللغة الإنجليزية، الطلاب، وكل من يرغب في تحسين مستواه العام.",
        imageFile: "general English.jpg",
      },
      {
        title: "IELTS",
        price: 180,
        discount: 15,
        description: "إعداد اختبار IELTS.",
        courseBenefits:
          "التعرف على أقسام اختبار IELTS، تحسين مهارات الإجابة، التدريب على نماذج امتحانات حقيقية.",
        wayOfTraining:
          "محاضرات متخصصة، تدريبات عملية، اختبارات تجريبية، مراجعات مستمرة.",
        targetAudience:
          "الراغبون في الهجرة أو الدراسة بالخارج، وطلاب الجامعات.",
        imageFile: "IELTS.jpg",
      },
      {
        title: "TOFEL",
        price: 180,
        discount: 15,
        description: "إعداد اختبار TOEFL.",
        courseBenefits:
          "فهم نظام اختبار TOEFL، تحسين مهارات اللغة الأكاديمية، زيادة فرص الحصول على درجات مرتفعة.",
        wayOfTraining: "شرح تفصيلي، تدريبات مكثفة، نماذج اختبارات، توجيه فردي.",
        targetAudience:
          "طلاب الجامعات والدراسات العليا والراغبون في الدراسة بالخارج.",
        imageFile: "TOFEL.jpg",
      },
      {
        title: "English Training",
        price: 160,
        discount: 10,
        description: "تدريب شامل للغة الإنجليزية.",
        courseBenefits:
          "تطوير شامل لمهارات اللغة، تحسين الطلاقة، الاستخدام العملي للغة في بيئة العمل.",
        wayOfTraining: "تدريب عملي، تمارين تفاعلية، محادثات، مواقف واقعية.",
        targetAudience:
          "الخريجون، الموظفون، وكل من يحتاج اللغة الإنجليزية في العمل.",
        imageFile: "English Traning.jpg",
      },
      {
        title: "Conversation",
        price: 140,
        discount: 5,
        description: "مهارات المحادثة الإنجليزية.",
        courseBenefits:
          "تحسين الطلاقة، التخلص من رهبة التحدث، استخدام التعبيرات اليومية بثقة.",
        wayOfTraining: "جلسات محادثة، تمثيل أدوار، مناقشات جماعية.",
        targetAudience: "من لديهم أساسيات اللغة ويرغبون في تحسين التحدث.",
        imageFile: "Conversation.jpg",
      },
    ],
  },
  {
    name: "دورات إدارة الأعمال والقيادة",
    folder: path.join(baseDir, "كورسات إدارة الأعمال والقيادة"),
    courses: [
      {
        title: "ريادة الأعمال",
        price: 200,
        discount: 10,
        description: "ريادة الأعمال",
        courseBenefits:
          "فهم أساسيات إنشاء المشاريع، تطوير الأفكار الريادية، إدارة المخاطر.",
        wayOfTraining: "محاضرات عملية، دراسات حالة، مناقشات تطبيقية.",
        targetAudience:
          "رواد الأعمال، أصحاب المشاريع الناشئة، المهتمون بإنشاء أعمالهم الخاصة.",
        imageFile: "ريادة أعمال.jpg",
      },
      {
        title: "إدارة المشروعات",
        price: 200,
        discount: 10,
        description: "إدارة المشروعات",
        courseBenefits:
          "التخطيط الفعّال للمشروعات، إدارة الوقت والتكلفة، متابعة التنفيذ.",
        wayOfTraining: "شرح نظري، تطبيقات عملية، نماذج واقعية.",
        targetAudience: "مديرو المشروعات، المهندسون، العاملون في فرق العمل.",
        imageFile: "إدارة المشروعات.jpg",
      },
      {
        title: "مهارات اتخاذ القرار وحل المشكلات",
        price: 180,
        discount: 10,
        description: "مهارات اتخاذ القرار وحل المشكلات",
        courseBenefits:
          "تحليل المشكلات بفعالية، اتخاذ قرارات سليمة، تحسين التفكير المنطقي.",
        wayOfTraining: "تمارين ذهنية، حالات عملية، نقاشات تفاعلية.",
        targetAudience:
          "المديرون، القادة، وكل من يعمل في بيئات تتطلب قرارات سريعة.",
        imageFile: "حل المشكلات (2).jpg",
      },
      {
        title: "إعداد المديرين",
        price: 190,
        discount: 10,
        description: "إعداد المديرين",
        courseBenefits:
          "تنمية المهارات الإدارية، تحسين أساليب القيادة، إدارة فرق العمل.",
        wayOfTraining: "محاضرات تدريبية، ورش عمل، تطبيقات عملية.",
        targetAudience: "المديرون الجدد، المشرفون، المرشحون للمناصب القيادية.",
        imageFile: "إعداد المديرين.jpg",
      },
      {
        title: "إعداد القادة",
        price: 190,
        discount: 10,
        description: "إعداد القادة",
        courseBenefits:
          "بناء الشخصية القيادية، تعزيز مهارات التأثير، قيادة الفرق بفعالية.",
        wayOfTraining: "تدريب تفاعلي، دراسات حالة، أنشطة قيادية.",
        targetAudience: "القادة، المديرون، الطامحون للمناصب القيادية.",
        imageFile: "إعداد القادة.jpg",
      },
      {
        title: "مهارات التسويق",
        price: 180,
        discount: 10,
        description: "مهارات التسويق",
        courseBenefits:
          "فهم أساسيات التسويق، تطوير استراتيجيات فعالة، تحليل السوق.",
        wayOfTraining: "شرح تطبيقي، أمثلة واقعية، تمارين عملية.",
        targetAudience: "المسوقون، أصحاب الأعمال، المهتمون بالتسويق.",
        imageFile: "مهارات التسويق.jpg",
      },
      {
        title: "مهارات التفاوض",
        price: 180,
        discount: 10,
        description: "مهارات التفاوض",
        courseBenefits:
          "تحسين أساليب التفاوض، تحقيق أفضل النتائج، إدارة الخلافات.",
        wayOfTraining: "تمثيل أدوار، حالات تفاوض، تدريب عملي.",
        targetAudience: "المديرون، موظفو المبيعات، وكل من يتعامل مع التفاوض.",
        imageFile: "مهارات التفاوض.jpg",
      },
      {
        title: "التخطيط الاستراتيجي",
        price: 200,
        discount: 15,
        description: "التخطيط الاستراتيجي",
        courseBenefits: "وضع خطط طويلة المدى، تحليل البيئة الداخلية والخارجية.",
        wayOfTraining: "محاضرات متخصصة، دراسات حالة، تطبيقات عملية.",
        targetAudience: "الإدارة العليا، القيادات التنفيذية.",
        imageFile: "التخطيط الاستراتيجي.jpg",
      },
      {
        title: "HR",
        price: 190,
        discount: 10,
        description: "الموارد البشرية",
        courseBenefits:
          "فهم إدارة الموارد البشرية، تطوير سياسات التوظيف والتقييم.",
        wayOfTraining: "شرح نظري، تطبيقات عملية، نماذج إدارية.",
        targetAudience: "موظفو الموارد البشرية، المديرون.",
        imageFile: "HR.jpg",
      },
      {
        title: "القيادة الفعالة",
        price: 190,
        discount: 10,
        description: "القيادة الفعالة",
        courseBenefits: "تعزيز مهارات القيادة، بناء فرق ناجحة، تحقيق الأهداف.",
        wayOfTraining: "تدريب تفاعلي، مناقشات، تمارين عملية.",
        targetAudience: "القادة، المديرون، المشرفون.",
        imageFile: "القيادة الفعالة.jpg",
      },
      {
        title: "الحوكمة الرشيدة",
        price: 200,
        discount: 15,
        description: "الحوكمة الرشيدة",
        courseBenefits: "تعزيز الشفافية، تحسين نظم الرقابة، الالتزام المؤسسي.",
        wayOfTraining: "محاضرات تخصصية، دراسات حالة.",
        targetAudience: "الإدارة العليا، القيادات المؤسسية.",
        imageFile: "الحوكمة الرشيدة.jpg",
      },
      {
        title: "كتابة التقارير والمكاتبات الرسمية",
        price: 170,
        discount: 10,
        description: "كتابة التقارير والمكاتبات الرسمية",
        courseBenefits: "تحسين أسلوب الكتابة، إعداد تقارير احترافية.",
        wayOfTraining: "شرح عملي، نماذج تطبيقية، تدريبات كتابية.",
        targetAudience: "الموظفون الإداريون، السكرتارية، المديرون.",
        imageFile: "كتابة التقارير والمكاتبات الرسمية.jpg",
      },
      {
        title: "إدارة الموارد البشرية",
        price: 190,
        discount: 10,
        description: "إدارة الموارد البشرية",
        courseBenefits: "إدارة الكفاءات، تطوير الأداء الوظيفي.",
        wayOfTraining: "محاضرات، تطبيقات عملية.",
        targetAudience: "مديرو الموارد البشرية، مسؤولو التوظيف.",
        imageFile: "إدارة الموارد البشرية.jpg",
      },
      {
        title: "دبلومة إدارة الأعمال الرقمية",
        price: 220,
        discount: 15,
        description: "دبلومة إدارة الأعمال الرقمية",
        courseBenefits: "فهم التحول الرقمي، إدارة الأعمال الحديثة.",
        wayOfTraining: "تدريب شامل، حالات عملية، مشاريع تطبيقية.",
        targetAudience: "أصحاب الأعمال، المديرون، رواد الأعمال.",
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
        courseBenefits:
          "تنمية مهارات التدريس الحديثة، استخدام استراتيجيات التعليم النشط، تطوير القدرة على التعامل مع الطلاب بفاعلية.",
        wayOfTraining: "محاضرات تدريبية، تطبيقات عملية، ورش عمل تعليمية.",
        targetAudience:
          "المعلمون، خريجو كليات التربية، وكل من يرغب في العمل بمجال التعليم.",
        imageFile: "إعداد معلم المستقبل.jpg",
      },
      {
        title: "إعداد محاضر رقمي",
        price: 180,
        discount: 10,
        description: "إعداد محاضر رقمي",
        courseBenefits:
          "إتقان مهارات الإلقاء الرقمي، إعداد محتوى تعليمي إلكتروني، استخدام أدوات التعليم عن بُعد.",
        wayOfTraining: "تدريب عملي، تطبيقات رقمية، محاضرات تفاعلية.",
        targetAudience: "المحاضرون، المدربون، العاملون في التعليم الإلكتروني.",
        imageFile: "إعداد محاضر رقمي.jpg",
      },
      {
        title: "إعداد باحث علمي محترف",
        price: 200,
        discount: 10,
        description: "إعداد باحث علمي محترف",
        courseBenefits:
          "تنمية مهارات البحث العلمي، إعداد الرسائل العلمية، استخدام أدوات التحليل الأكاديمي.",
        wayOfTraining: "شرح منهجي، تطبيقات بحثية، نماذج عملية.",
        targetAudience: "طلاب الدراسات العليا، الباحثون، أعضاء هيئة التدريس.",
        imageFile: "إعداد باحث علمي محترف.jpg",
      },
      {
        title: "إعداد أخصائي نظم معلومات",
        price: 200,
        discount: 10,
        description: "إعداد أخصائي نظم معلومات",
        courseBenefits:
          "فهم نظم المعلومات، تحليل البيانات، دعم اتخاذ القرار المؤسسي.",
        wayOfTraining: "محاضرات تطبيقية، دراسات حالة، تدريب عملي.",
        targetAudience: "خريجو الحاسبات، العاملون في مجال تكنولوجيا المعلومات.",
        imageFile: "إعداد أخصائي نظم معلومات.jpg",
      },
      {
        title: "إعداد المدربين",
        price: 180,
        discount: 10,
        description: "إعداد المدربين",
        courseBenefits:
          "اكتساب مهارات التدريب الاحترافي، تصميم البرامج التدريبية، تحسين أسلوب العرض.",
        wayOfTraining: "ورش عمل، تمثيل أدوار، تطبيقات عملية.",
        targetAudience: "المدربون، الراغبون في العمل بالمجال التدريبي.",
        imageFile: "إعداد المدربين.jpg",
      },
      {
        title: "دورة مهارات التدريس",
        price: 160,
        discount: 10,
        description: "دورة مهارات التدريس",
        courseBenefits:
          "تحسين أساليب الشرح، إدارة الفصل الدراسي، توصيل المعلومة بفاعلية.",
        wayOfTraining: "شرح تطبيقي، تدريبات تعليمية، أمثلة عملية.",
        targetAudience: "المعلمين، المحاضرين، المدربين.",
        imageFile: "دورة مهارات التدريس.jpg",
      },
      {
        title: "دبلومة التحليل الإحصائي",
        price: 220,
        discount: 15,
        description: "دبلومة التحليل الإحصائي",
        courseBenefits:
          "تحليل البيانات بدقة، استخدام البرامج الإحصائية، دعم البحث العلمي.",
        wayOfTraining:
          "شرح عملي، تطبيقات إحصائية، تدريبات باستخدام أمثلة حقيقية.",
        targetAudience:
          "الباحثون، طلاب الدراسات العليا، المهتمون بالتحليل الإحصائي.",
        imageFile: "دبلومة التحليل الإحصائي.jpg",
      },
      {
        title: "دبلومة الأمن السيبراني",
        price: 240,
        discount: 15,
        description: "دبلومة الأمن السيبراني",
        courseBenefits:
          "فهم أساسيات الأمن السيبراني، حماية الأنظمة، التعرف على التهديدات الرقمية.",
        wayOfTraining: "تدريب عملي، سيناريوهات واقعية، محاضرات تخصصية.",
        targetAudience:
          "متخصصو تقنية المعلومات، الطلاب، المهتمون بالأمن الرقمي.",
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
        courseBenefits: "تنمية مهارات التواصل، العمل الجماعي، إدارة الذات.",
        wayOfTraining: "تدريب تفاعلي، تمارين جماعية، مواقف عملية.",
        targetAudience: "الطلاب، الخريجون، الموظفون.",
        imageFile: "Soft Skills.jpg",
      },
      {
        title: "اللغة الإنجليزية",
        price: 150,
        discount: 10,
        description: "اللغة الإنجليزية",
        courseBenefits: "تحسين مستوى اللغة، تعزيز مهارات التواصل.",
        wayOfTraining: "شرح مبسط، تدريبات عملية، محادثات.",
        targetAudience: "المبتدئون والمهتمون بتعلم اللغة.",
        imageFile: "اللغة الإنجليزية.jpg",
      },
      {
        title: "الذكاء الاصطناعي",
        price: 170,
        discount: 10,
        description: "الذكاء الاصطناعي",
        courseBenefits:
          "فهم أساسيات الذكاء الاصطناعي، التعرف على تطبيقاته الحديثة.",
        wayOfTraining: "شرح نظري، أمثلة تطبيقية.",
        targetAudience: "الطلاب، المهتمون بالتقنية.",
        imageFile: "الذكاء الاصطناعي.jpg",
      },
      {
        title: "إدارة الوقت",
        price: 150,
        discount: 10,
        description: "إدارة الوقت",
        courseBenefits: "تنظيم الوقت، زيادة الإنتاجية، تحقيق التوازن.",
        wayOfTraining: "تمارين عملية، تطبيقات حياتية.",
        targetAudience: "الطلاب، الموظفون.",
        imageFile: "إدارة الوقت.jpg",
      },
      {
        title: "إدارة الغضب والضغوط",
        price: 160,
        discount: 10,
        description: "إدارة الغضب والضغوط",
        courseBenefits: "السيطرة على الانفعالات، التعامل مع الضغوط بوعي.",
        wayOfTraining: "جلسات تدريبية، تمارين نفسية.",
        targetAudience: "جميع الفئات.",
        imageFile: "إدارة الغضب والضغوط.jpg",
      },
      {
        title: "القيادة الشبابية",
        price: 170,
        discount: 10,
        description: "القيادة الشبابية",
        courseBenefits: "تنمية روح القيادة، بناء الثقة بالنفس.",
        wayOfTraining: "أنشطة قيادية، تدريب تفاعلي.",
        targetAudience: "الشباب، طلاب الجامعات.",
        imageFile: "القيادة الشبابية.jpg",
      },
      {
        title: "TOT",
        price: 160,
        discount: 10,
        description: "TOT",
        courseBenefits: "إعداد مدربين محترفين، تطوير مهارات العرض.",
        wayOfTraining: "ورش تدريبية، تطبيقات عملية.",
        targetAudience: "المدربون، الراغبون في مجال التدريب.",
        imageFile: "TOT.jpg",
      },
      {
        title: "المهارات الحياتية",
        price: 150,
        discount: 10,
        description: "المهارات الحياتية",
        courseBenefits: "تحسين جودة الحياة، تعزيز مهارات التكيف.",
        wayOfTraining: "أنشطة تفاعلية، تطبيقات يومية.",
        targetAudience: "جميع الفئات العمرية.",
        imageFile: "المهارات الحياتية.jpg",
      },
    ],
  },

  {
    name: "دورات علم النفس والصحة النفسية",
    folder: path.join(baseDir, "كورسات علم النفس والصحة النفسية"),
    courses: [
      {
        title: "دبلومة التخاطب الخاصة",
        price: 220,
        discount: 15,
        description: "دبلومة التخاطب الخاصة",
        courseBenefits: "تشخيص اضطرابات النطق، إعداد خطط علاجية فعالة.",
        wayOfTraining: "محاضرات تخصصية، تدريب عملي.",
        targetAudience: "أخصائيو التخاطب، المهتمون بالمجال.",
        imageFile: "دبلومة التخاطب الخاصة.jpg",
      },
      {
        title: "دبلومة صعوبات التعلم",
        price: 220,
        discount: 15,
        description: "دبلومة صعوبات التعلم",
        courseBenefits: "تشخيص صعوبات التعلم، التعامل مع الحالات المختلفة.",
        wayOfTraining: "شرح علمي، تطبيقات عملية.",
        targetAudience: "المعلمين، الأخصائيين.",
        imageFile: "دبلومة صعوبات التعلم.jpg",
      },
      {
        title: "دبلومة تعديل السلوك",
        price: 210,
        discount: 15,
        description: "دبلومة تعديل السلوك",
        courseBenefits: "فهم السلوك الإنساني، تصميم برامج تعديل السلوك.",
        wayOfTraining: "جلسات تدريبية، حالات عملية.",
        targetAudience: "الأخصائيون النفسيون، المعلمون.",
        imageFile: "دبلومة تعديل السلوك.jpg",
      },
      {
        title: "دبلومة طيف التوحد",
        price: 230,
        discount: 15,
        description: "دبلومة طيف التوحد",
        courseBenefits: "فهم اضطراب التوحد، التعامل مع الأطفال بفاعلية.",
        wayOfTraining: "محاضرات تخصصية، تدريب عملي.",
        targetAudience: "الأخصائيون، أولياء الأمور.",
        imageFile: "دبلومة طيف التوحد.jpg",
      },
      {
        title: "دبلومة الإعاقات",
        price: 210,
        discount: 15,
        description: "دبلومة الإعاقات",
        courseBenefits: "التعرف على أنواع الإعاقات، أساليب الدعم.",
        wayOfTraining: "شرح علمي، تطبيقات عملية.",
        targetAudience: "المعلمين، الأخصائيين.",
        imageFile: "دبلومة الإعاقات.jpg",
      },
      {
        title: "دبلومة تنمية المهارات",
        price: 200,
        discount: 15,
        description: "دبلومة تنمية المهارات",
        courseBenefits: "تنمية القدرات الذهنية والاجتماعية.",
        wayOfTraining: "أنشطة تدريبية، تمارين تطبيقية.",
        targetAudience: "الأطفال، الأخصائيون.",
        imageFile: "دبلومة تنمية المهارات.jpg",
      },
      {
        title: "دبلومة الإرشاد الأسري والزواجي",
        price: 230,
        discount: 15,
        description: "دبلومة الإرشاد الأسري والزواجي",
        courseBenefits: "حل المشكلات الأسرية، تحسين العلاقات الزوجية.",
        wayOfTraining: "جلسات إرشادية، حالات عملية.",
        targetAudience: "الأخصائيون النفسيون، المرشدون.",
        imageFile: "دبلومة الإرشاد الأسري والزواجي.jpg",
      },
      {
        title: "دبلومة الصحة النفسية",
        price: 230,
        discount: 15,
        description: "دبلومة الصحة النفسية",
        courseBenefits: "تعزيز الصحة النفسية، فهم الاضطرابات النفسية.",
        wayOfTraining: "محاضرات علمية، تطبيقات عملية.",
        targetAudience: "المهتمون بالصحة النفسية.",
        imageFile: "دبلومة الصحة النفسية.jpg",
      },
      {
        title: "دبلومة علم النفس التكاملية",
        price: 240,
        discount: 15,
        description: "دبلومة علم النفس التكاملية",
        courseBenefits: "فهم شامل لمدارس علم النفس.",
        wayOfTraining: "شرح أكاديمي، حالات تطبيقية.",
        targetAudience: "طلاب علم النفس، الأخصائيون.",
        imageFile: "دبلومة علم النفس التكاملية.jpg",
      },
      {
        title: "المقاييس والاختبارات النفسية",
        price: 200,
        discount: 10,
        description: "المقاييس والاختبارات النفسية",
        courseBenefits: "استخدام الاختبارات النفسية بدقة.",
        wayOfTraining: "تدريب عملي، نماذج تطبيقية.",
        targetAudience: "الأخصائيون النفسيون.",
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
const mahmoudId = "cmjyv7yqf0000nswkug9ouhan";
const khaledId = "cmjyv803s0001nswksikp6had";

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
      groupsSkipped++;
      // Ensure the group has the correct instructorId
      if (group.instructorId !== instructorId) {
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
        // Update existing course with new fields if they're missing or different
        const needsUpdate =
          existingCourse.courseBenefits !== (c.courseBenefits ?? null) ||
          existingCourse.wayOfTraining !== (c.wayOfTraining ?? null) ||
          existingCourse.targetAudience !== (c.targetAudience ?? null) ||
          existingCourse.description !== (c.description ?? null) ||
          existingCourse.price !== (c.price ?? defPrice) ||
          existingCourse.discount !== (c.discount ?? defDiscount);

        if (needsUpdate) {
          // prefer provided imageFile name (sans extension); else use title
          const baseName = c.imageFile
            ? stripExt(c.imageFile)
            : stripExt(c.title);
          let url = existingCourse.coursePhotoUrl;

          // Try to update photo if imageFile is provided
          if (c.imageFile) {
            try {
              const filePath = await resolveImagePath(g.folder, baseName);
              const uploaded = await uploadImage(
                filePath,
                `edu/courses/${g.name}`
              );
              url = uploaded.url;
            } catch (err) {
              console.warn(
                `Skipping photo update for course "${c.title}" in group "${g.name}": ${err.message}`
              );
            }
          }

          await prisma.course.update({
            where: { id: existingCourse.id },
            data: {
              courseBenefits: c.courseBenefits ?? null,
              wayOfTraining: c.wayOfTraining ?? null,
              targetAudience: c.targetAudience ?? null,
              description: c.description ?? null,
              price: c.price ?? defPrice,
              discount: c.discount ?? defDiscount,
              coursePhotoUrl: url,
            },
          });
          console.log(`Updated course: "${c.title}" in group "${g.name}"`);
        } else {
          console.log(`Course "${c.title}" already up-to-date, skipping.`);
        }
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
          courseBenefits: c.courseBenefits ?? null,
          wayOfTraining: c.wayOfTraining ?? null,
          targetAudience: c.targetAudience ?? null,
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
