import { Router } from "express";
import multer from "multer";
import {
  createArticle,
  getArticles,
  getArticlesByCategoryId,
  updateArticle,
  deleteArticle,
} from "./articles.controller.js";

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post("/articles", upload.single("image"), createArticle);
router.put("/articles/:id", upload.single("image"), updateArticle);
router.get("/articles", getArticles);
router.get("/articles/category/:categoryId", getArticlesByCategoryId);
router.delete("/articles/:id", deleteArticle);

export default router;
