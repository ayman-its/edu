import prisma from "../../config/prisma.js";
import { uploadFromBuffer } from "../../middleware/cloudinary.js";

export const createArticle = async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // 1. UPLOAD PHOTO
    let articleImageUrl = imageUrl || null;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, {
        folder: "edu/articles",
      });
      articleImageUrl = result.secure_url;
    }

    // Build data object
    // Note: article schema only has: id, title, content, imageUrl
    const articleData = {
      title,
    };

    // Add optional fields only if they are provided
    if (content !== undefined && content !== null && content !== "")
      articleData.content = content;
    if (articleImageUrl !== undefined && articleImageUrl !== null)
      articleData.imageUrl = articleImageUrl;

    const article = await prisma.article.create({
      data: articleData,
    });
    res
      .status(201)
      .json({ message: "Article created successfully", data: article });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Failed to create article" });
  }
};

export const getArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany();
    res
      .status(200)
      .json({ message: "Articles fetched successfully", data: articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Failed to get articles" });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id } });
    res
      .status(200)
      .json({ message: "Article fetched successfully", data: article });
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    res.status(500).json({ message: "Failed to get article by ID" });
  }
};

export const getArticlesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Validate categoryId
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Check if category exists
    const category = await prisma.categoryArticle.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Get articles by category
    const articles = await prisma.article.findMany({
      where: {
        categoryArticleId: categoryId,
      },
      include: {
        categoryArticle: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Articles fetched successfully",
      data: articles,
      category: {
        id: category.id,
        name: category.name,
      },
    });
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    res.status(500).json({ message: "Failed to get articles by category" });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, imageUrl } = req.body;

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Build update data object
    const updateData = {};

    // Allow clearing fields by checking undefined vs empty string
    if (title !== undefined) {
      updateData.title = title; // Allow empty string to clear
    }
    if (content !== undefined) {
      updateData.content = content || null; // Allow empty string, convert to null
    }

    // Handle image update
    // Note: article schema only has: id, title, content, imageUrl
    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, {
        folder: "edu/articles",
      });
      updateData.imageUrl = result.secure_url;
    } else if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
    });
    res
      .status(200)
      .json({ message: "Article updated successfully", data: article });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Failed to update article" });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    await prisma.article.delete({
      where: { id },
    });

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Failed to delete article" });
  }
};
