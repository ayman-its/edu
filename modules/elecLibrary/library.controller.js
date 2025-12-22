import prisma from "../../config/prisma.js";
import { uploadFromBuffer } from "../../middleware/cloudinary.js";

export const createLibrary = async (req, res) => {
  try {
    const { title, content, imageUrl, categoryLibraryId } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!categoryLibraryId) {
      return res
        .status(400)
        .json({ message: "Category Library ID is required" });
    }
    if (typeof categoryLibraryId !== "string") {
      return res
        .status(400)
        .json({ message: "Category Library ID must be a string" });
    }
    if (!categoryLibraryId.trim()) {
      return res
        .status(400)
        .json({ message: "Category Library ID must be a non-empty string" });
    }

    // Check if category exists
    const categoryLibrary = await prisma.categoryLibrary.findUnique({
      where: { id: categoryLibraryId },
    });
    if (!categoryLibrary) {
      return res.status(404).json({ message: "Category Library not found" });
    }

    // 1. UPLOAD PHOTO
    let libraryImageUrl = imageUrl || null;
    let photoPublicId = null;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, {
        folder: "edu/library",
      });
      libraryImageUrl = result.secure_url;
      photoPublicId = result.public_id;
    }

    // Build data object
    const libraryData = {
      title,
      categoryLibraryId,
    };

    // Add optional fields only if they are provided
    if (content !== undefined) libraryData.content = content;
    if (libraryImageUrl !== undefined && libraryImageUrl !== null)
      libraryData.imageUrl = libraryImageUrl;
    if (photoPublicId !== undefined && photoPublicId !== null)
      libraryData.photoPublicId = photoPublicId;

    const library = await prisma.library.create({
      data: libraryData,
    });
    res
      .status(201)
      .json({ message: "Library created successfully", data: library });
  } catch (error) {
    console.error("Error creating library:", error);
    res.status(500).json({ message: "Failed to create library" });
  }
};

export const getLibrary = async (req, res) => {
  try {
    const libraries = await prisma.library.findMany({
      include: {
        categoryLibrary: true,
      },
    });
    res.json(libraries);
  } catch (error) {
    console.error("Error fetching libraries:", error);
    res.status(500).json({ message: "Failed to get libraries" });
  }
};

export const updateLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, imageUrl, categoryLibraryId } = req.body;

    // 1. UPLOAD PHOTO if new file is provided
    let libraryImageUrl = imageUrl || null;
    let photoPublicId = null;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, {
        folder: "edu/library",
      });
      libraryImageUrl = result.secure_url;
      photoPublicId = result.public_id;
    }

    // Build update data object
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (categoryLibraryId !== undefined)
      updateData.categoryLibraryId = categoryLibraryId;
    if (libraryImageUrl !== undefined && libraryImageUrl !== null)
      updateData.imageUrl = libraryImageUrl;
    if (photoPublicId !== undefined && photoPublicId !== null)
      updateData.photoPublicId = photoPublicId;

    const library = await prisma.library.update({
      where: { id },
      data: updateData,
    });
    res.json({ message: "Library updated successfully", data: library });
  } catch (error) {
    console.error("Error updating library:", error);
    res.status(500).json({ message: "Failed to update library" });
  }
};

export const deleteLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.library.delete({
      where: { id },
    });
    res.json({ message: "Library deleted successfully" });
  } catch (error) {
    console.error("Error deleting library:", error);
    res.status(500).json({ message: "Failed to delete library" });
  }
};
