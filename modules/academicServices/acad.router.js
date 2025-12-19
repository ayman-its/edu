import { Router } from "express";
import {
  // Category operations
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  // Service operations
  getServicesByCategoryId,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "./acad.controller.js";

const router = Router();

// ============================================
// CATEGORY ROUTES
// ============================================

/**
 * GET /api/academic/categories
 * Get all academic categories
 */
router.get("/categories", getAllCategories);

/**
 * GET /api/academic/categories/:id
 * Get category by ID
 */
router.get("/categories/:id", getCategoryById);

/**
 * POST /api/academic/categories
 * Create a new academic category
 */
router.post("/categories", createCategory);

/**
 * DELETE /api/academic/categories/:id
 * Delete an academic category
 */
router.delete("/categories/:id", deleteCategory);

// ============================================
// SERVICE ROUTES
// ============================================

/**
 * GET /api/academic/services/category/:categoryId
 * Get all academic services by category ID
 */
router.get("/services/category/:categoryId", getServicesByCategoryId);

/**
 * GET /api/academic/services/:id
 * Get academic service by service ID
 */
router.get("/services/:id", getServiceById);

/**
 * POST /api/academic/services
 * Create a new academic service
 */
router.post("/services", createService);

/**
 * PUT /api/academic/services/:id
 * Update academic service by service ID
 */
router.put("/services/:id", updateService);

/**
 * DELETE /api/academic/services/:id
 * Delete academic service by service ID
 */
router.delete("/services/:id", deleteService);

export default router;
