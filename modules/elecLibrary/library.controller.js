import prisma from "../../config/prisma.js";
import { uploadFromBuffer } from "../../middleware/cloudinary.js";

export const createLibrary = async (req, res) => {
  try {
    const { title, content, imageUrl, type } = req.body;

    // Validate title
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Validate Enum Type
    const validTypes = ["ARABIC_ABSTRACTS", "ENGLISH_ABSTRACTS"];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid type. Must be ARABIC_ABSTRACTS or ENGLISH_ABSTRACTS",
      });
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
    const library = await prisma.ResearchAbstract.create({
      data: {
        title,
        type,
        content: content || null,
        imageUrl: libraryImageUrl,
        photoPublicId: photoPublicId,
      },
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
    // Removed the "include" because there is no more relation
    const libraries = await prisma.ResearchAbstract.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(libraries);
  } catch (error) {
    console.error("Error fetching libraries:", error);
    res.status(500).json({ message: "Failed to get libraries" });
  }
};

export const getLibraryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const library = await prisma.ResearchAbstract.findUnique({
      where: { id },
    });

    if (!library) return res.status(404).json({ message: "Library not found" });

    res.json(library);
  } catch (error) {
    console.error("Error fetching library by ID:", error);
    res.status(500).json({ message: "Failed to get library by ID" });
  }
};

export const updateLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, imageUrl, type } = req.body;

    let updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (type) updateData.type = type;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, {
        folder: "edu/library",
      });
      updateData.imageUrl = result.secure_url;
      updateData.photoPublicId = result.public_id;
    } else if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const library = await prisma.ResearchAbstract.update({
      where: { id },
      data: updateData,
    });
    res.json({ message: "Library updated successfully", data: library });
  } catch (error) {
    console.error("Error updating library:", error);
    res.status(500).json({ message: "Failed to update library" });
  }
};

// deleteLibrary stays the same as your original code
export const deleteLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.ResearchAbstract.delete({
      where: { id },
    });
    res.json({ message: "Library deleted successfully" });
  } catch (error) {
    console.error("Error deleting library:", error);
    res.status(500).json({ message: "Failed to delete library" });
  }
};
