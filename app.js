import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import routers
import authRouter from "./modules/auth/auth.router.js";
import homeRouter from "./modules/home/home.router.js";
import courseRouter from "./modules/courseServices/course.router.js";
import academicRouter from "./modules/academicServices/acad.router.js";
import adminRouter from "./modules/admin/admin.router.js";
import articlesRouter from "./modules/articles/articles.router.js";
import libraryRouter from "./modules/elecLibrary/library.router.js";
import servicesRouter from "./modules/services/services.router.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api", homeRouter);
app.use("/api/course", courseRouter);
app.use("/api/academic", academicRouter);
app.use("/api/admin", adminRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/library", libraryRouter);
app.use("/api/services", servicesRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

export default app;
