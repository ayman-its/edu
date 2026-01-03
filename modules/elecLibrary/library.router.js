import { Router } from "express";
import multer from "multer";
import {
  createLibrary,
  getLibrary,
  updateLibrary,
  deleteLibrary,
  getLibraryById,
} from "./library.controller.js";

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post("/library", upload.single("image"), createLibrary);
router.get("/library", getLibrary);
router.get("/library/:id", getLibraryById);
router.put("/library/:id", upload.single("image"), updateLibrary);
router.delete("/library/:id", deleteLibrary);

export default router;
