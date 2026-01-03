import prisma from "../../config/prisma.js";
import { uploadFromBuffer } from "../../middleware/cloudinary.js";

export const createArticle = async (req, res) => {
  try {
    const { title, content, imageUrl, categoryArticleId } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!categoryArticleId) {
      return res
        .status(400)
        .json({ message: "Category Article ID is required" });
    }
    if (typeof categoryArticleId !== "string") {
      return res
        .status(400)
        .json({ message: "Category Article ID must be a string" });
    }
    if (!categoryArticleId.trim()) {
      return res
        .status(400)
        .json({ message: "Category Article ID must be a non-empty string" });
    }

    // Check if category exists
    const categoryArticle = await prisma.categoryArticle.findUnique({
      where: { id: categoryArticleId },
    });
    if (!categoryArticle) {
      return res.status(404).json({ message: "Category Article not found" });
    }

    // 1. UPLOAD PHOTO
    let articleImageUrl = imageUrl || null;
    let photoPublicId = null;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, {
        folder: "edu/articles",
      });
      articleImageUrl = result.secure_url;
      photoPublicId = result.public_id;
    }

    // Build data object
    const articleData = {
      title,
      categoryArticleId,
    };

    // Add optional fields only if they are provided
    if (content !== undefined) articleData.content = content;
    if (articleImageUrl !== undefined && articleImageUrl !== null)
      articleData.imageUrl = articleImageUrl;
    if (photoPublicId !== undefined && photoPublicId !== null)
      articleData.photoPublicId = photoPublicId;

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
    const { title, content, imageUrl, categoryArticleId } = req.body;
    const article = await prisma.article.update({
      where: { id },
      data: { title, content, imageUrl, categoryArticleId },
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
    const article = await prisma.article.delete({
      where: { id },
    });
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Failed to delete article" });
  }
};
