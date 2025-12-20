import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.router.js";
import academicRoutes from "./modules/academicServices/acad.router.js";
import courseRoutes from "./modules/courseServices/course.router.js";
import homeRoutes from "./modules/home/home.router.js";
const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.get("/debug-env", (req, res) => {
  res.json({
    hasDbUrl: !!process.env.DATABASE_URL,
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/course", courseRoutes);
app.use("/",homeRoutes)
export default app;
