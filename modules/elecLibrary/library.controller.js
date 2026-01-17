import prisma from "../../config/prisma.js";
import { uploadFromBuffer } from "../../middleware/cloudinary.js";

export const createLibrary = async (req, res) => {
  try {
    const { title, content, type } = req.body;

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

    // Build data object
    // Note: ResearchAbstract schema only has: id, title, ResearchType, content, subTitle, author, degree, university, location
    // No imageUrl or photoPublicId fields exist in schema
    const library = await prisma.ResearchAbstract.create({
      data: {
        title,
        ResearchType: type, // Schema field is ResearchType, not type
        content: content || null,
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
    const { title, content, type } = req.body;

    // Convert string ID to number
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid library ID" });
    }

    // Check if library item exists
    const existingLibrary = await prisma.ResearchAbstract.findUnique({
      where: { id: numericId },
    });

    if (!existingLibrary) {
      return res.status(404).json({ message: "Library item not found" });
    }

    let updateData = {};
    
    // Allow clearing fields by checking undefined vs empty string
    if (title !== undefined) {
      updateData.title = title; // Allow empty string to clear
    }
    if (content !== undefined) {
      updateData.content = content || null; // Allow empty string, convert to null
    }
    if (type !== undefined) {
      // Validate type if provided
      const validTypes = ["ARABIC_ABSTRACTS", "ENGLISH_ABSTRACTS"];
      if (type && !validTypes.includes(type)) {
        return res.status(400).json({
          message: "Invalid type. Must be ARABIC_ABSTRACTS or ENGLISH_ABSTRACTS",
        });
      }
      // Schema field is ResearchType, not type
      updateData.ResearchType = type;
    }

    // Note: ResearchAbstract schema doesn't have imageUrl or photoPublicId fields
    // Image uploads are not supported in the current schema

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const library = await prisma.ResearchAbstract.update({
      where: { id: numericId },
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

    // Convert string ID to number
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid library ID" });
    }

    // Check if library item exists
    const existingLibrary = await prisma.ResearchAbstract.findUnique({
      where: { id: numericId },
    });

    if (!existingLibrary) {
      return res.status(404).json({ message: "Library item not found" });
    }

    await prisma.ResearchAbstract.delete({
      where: { id: numericId },
    });

    res.json({ message: "Library deleted successfully" });
  } catch (error) {
    console.error("Error deleting library:", error);
    res.status(500).json({ message: "Failed to delete library" });
  }
};
