import prisma from "../../config/prisma.js";

// ============================================
// CATEGORY OPERATIONS
// ============================================

/**
 * Create a new academic category
 * POST /api/academic/categories
 */
export const createCategory = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required and must be a non-empty string",
      });
    }

    // Check if category with same title already exists
    const existingCategory = await prisma.academicCategory.findFirst({
      where: { title: title.trim() },
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category with this title already exists",
      });
    }

    const category = await prisma.academicCategory.create({
      data: {
        title: title.trim(),
      },
    });

    return res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Delete an academic category
 * DELETE /api/academic/categories/:id
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }

    // Check if category exists
    const category = await prisma.academicCategory.findUnique({
      where: { id },
      include: {
        services: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Check if category has services
    if (category.services && category.services.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category with existing services. Please delete all services first.",
      });
    }

    // Delete the category
    await prisma.academicCategory.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get all categories
 * GET /api/academic/categories
 */
export const getAllCategories = async (req, res) => {
  try {


    // adding filter by category id 
    const categories = await prisma.academicCategory.findMany({
      include: {
        services: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get category by ID
 * GET /api/academic/categories/:id
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }

    const category = await prisma.academicCategory.findUnique({
      where: { id },
      include: {
        services: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ============================================
// SERVICE OPERATIONS
// ============================================

/**
 * Get all academic services
 * GET /api/academic/services
 */
export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.academicService.findMany({
      include: {
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Services retrieved successfully",
      data: services,
    });
  } catch (error) {
    console.error("Error fetching all services:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get academic services by category ID
 * GET /api/academic/services/category/:categoryId
 */
export const getServicesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }

    // Check if category exists
    const category = await prisma.academicCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Get all services for this category
    const services = await prisma.academicService.findMany({
      where: {
        categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Services retrieved successfully",
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services by category:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get academic service by service ID
 * GET /api/academic/services/:id
 */
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Service ID is required",
      });
    }

    const service = await prisma.academicService.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
      },
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    return res.status(200).json({
      message: "Service retrieved successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Create a new academic service
 * POST /api/academic/services
 */
export const createService = async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;

    // Validation
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required and must be a non-empty string",
      });
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return res.status(400).json({
        message: "Description is required and must be a non-empty string",
      });
    }

    if (!categoryId || typeof categoryId !== "string") {
      return res.status(400).json({
        message: "Category ID is required and must be a string",
      });
    }

    // Check if category exists
    const category = await prisma.academicCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Create the service
    const service = await prisma.academicService.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Update academic service by service ID
 * PUT /api/academic/services/:id
 */
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Service ID is required",
      });
    }

    // Check if service exists
    const existingService = await prisma.academicService.findUnique({
      where: { id },
    });

    if (!existingService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Build update data object
    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
          message: "Title must be a non-empty string",
        });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || description.trim() === "") {
        return res.status(400).json({
          message: "Description must be a non-empty string",
        });
      }
      updateData.description = description.trim();
    }

    if (categoryId !== undefined) {
      if (typeof categoryId !== "string") {
        return res.status(400).json({
          message: "Category ID must be a string",
        });
      }

      // Check if new category exists
      const category = await prisma.academicCategory.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      updateData.categoryId = categoryId;
    }

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No fields provided for update",
      });
    }

    // Update the service
    const updatedService = await prisma.academicService.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Delete academic service by service ID
 * DELETE /api/academic/services/:id
 */
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Service ID is required",
      });
    }

    // Check if service exists
    const service = await prisma.academicService.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Delete the service
    await prisma.academicService.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
