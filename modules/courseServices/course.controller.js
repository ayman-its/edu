import prisma from "../../config/prisma.js";
import { uploadFromBuffer, destroy } from "../../middleware/cloudinary.js";

export const createCourseGroup = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const group = await prisma.courseGroup.create({
      data: { name },
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Failed to create course group" });
  }
};
export const deleteCourseGroup = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if group has courses
    const coursesCount = await prisma.course.count({
      where: { groupId: id },
    });

    if (coursesCount > 0) {
      return res.status(400).json({
        message: "Cannot delete group with existing courses",
      });
    }

    await prisma.courseGroup.delete({
      where: { id },
    });

    res.json({ message: "Course group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course group" });
  }
};
export const getAllCourseGroups = async (req, res) => {
  try {
    const courseGroups = await prisma.courseGroup.findMany();
    res.json(courseGroups);
  } catch (error) {
    res.status(500).json({ message: "Failed to get course groups" });
  }
};
export const getCourseGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseGroup = await prisma.courseGroup.findUnique({
      where: { id },
    });
    res.json(courseGroup);
  } catch (error) {
    res.status(500).json({ message: "Failed to get course group" });
  }
};
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      instructorId,
      groupId,
      coursePhotoUrl,
      description,
      price,
      discount,
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!instructorId) {
      return res.status(400).json({ message: "Instructor ID is required" });
    }
    // 1. UPLOAD PHOTO
    let photoUrl = coursePhotoUrl || null;
    let photoPublicId = null;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, {
        folder: "edu/courses",
      });
      photoUrl = result.secure_url;
      photoPublicId = result.public_id;
    }

    // Build data object with only provided optional fields
    const courseData = {
      title,
      instructorId,
      groupId,
    };

    // Add optional fields only if they are provided
    if (photoUrl !== undefined && photoUrl !== null)
      courseData.coursePhotoUrl = photoUrl;
    if (photoPublicId !== undefined && photoPublicId !== null)
      courseData.photoPublicId = photoPublicId;
    if (description !== undefined) courseData.description = description;
    if (price !== undefined) courseData.price = price;
    if (discount !== undefined) courseData.discount = discount;

    const course = await prisma.course.create({
      data: courseData,
    });
    res.json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
};
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      instructorId,
      groupId,
      coursePhotoUrl,
      description,
      price,
      discount,
    } = req.body;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 1. UPLOAD PHOTO if new file is provided
    let photoUrl = coursePhotoUrl || existingCourse.coursePhotoUrl || null;
    let photoPublicId = existingCourse.photoPublicId || null;
    let oldPhotoPublicId = existingCourse.photoPublicId;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, {
        folder: "edu/courses",
      });
      photoUrl = result.secure_url;
      photoPublicId = result.public_id;

      // Delete old photo from Cloudinary if it exists
      if (oldPhotoPublicId) {
        try {
          await destroy(oldPhotoPublicId);
        } catch (error) {
          console.error("Error deleting old photo from Cloudinary:", error);
          // Continue even if deletion fails
        }
      }
    }

    // Build update data object
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (instructorId !== undefined) {
      // Validate instructor exists
      const instructor = await prisma.instructor.findUnique({
        where: { id: instructorId },
      });
      if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }
      updateData.instructorId = instructorId;
    }
    if (groupId !== undefined) {
      // Validate group exists
      const group = await prisma.courseGroup.findUnique({
        where: { id: groupId },
      });
      if (!group) {
        return res.status(404).json({ message: "Course group not found" });
      }
      updateData.groupId = groupId;
    }
    if (photoUrl !== undefined && photoUrl !== null)
      updateData.coursePhotoUrl = photoUrl;
    if (photoPublicId !== undefined && photoPublicId !== null)
      updateData.photoPublicId = photoPublicId;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const course = await prisma.course.update({
      where: { id },
      data: updateData,
    });
    res.json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Failed to update course" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Get course to delete old photo
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (course && course.photoPublicId) {
      try {
        await destroy(course.photoPublicId);
      } catch (error) {
        console.error("Error deleting photo from Cloudinary:", error);
        // Continue even if deletion fails
      }
    }

    await prisma.course.delete({
      where: { id },
    });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course" });
  }
};
export const getAllCourses = async (req, res) => {
  // adding filter by category id
  try {
    // Get all course groups (categories) with their courses and instructor
    const courseGroups = await prisma.courseGroup.findMany({
      include: {
        courses: {
          include: {
            instructor: true,
          },
        },
        instructor: true,
      },
    });

    // Get all courses with their details (group and instructor)
    const courses = await prisma.course.findMany({
      include: {
        group: true,
        instructor: true,
      },
    });

    // Get all instructors with their course groups and courses
    const instructors = await prisma.instructor.findMany({
      include: {
        courseGroups: {
          include: {
            courses: true,
          },
        },
        courses: {
          include: {
            group: true,
          },
        },
      },
    });

    res.json({
      courseCategories: courseGroups,
      courses: courses,
      instructors: instructors,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to get courses" });
  }
};
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Failed to get course" });
  }
};

export const getCoursesByGroupId = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Validate groupId
    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    // Check if group exists
    const group = await prisma.courseGroup.findUnique({
      where: { id: groupId },
      include: {
        instructor: true,
      },
    });

    if (!group) {
      return res.status(404).json({ message: "Course group not found" });
    }

    // Get courses by group
    const courses = await prisma.course.findMany({
      where: {
        groupId: groupId,
      },
      include: {
        group: {
          select: {
            id: true,
            title: true,
          },
        },
        instructor: true,
      },
    });

    res.status(200).json({
      message: "Courses fetched successfully",
      data: courses,
      group: {
        id: group.id,
        title: group.title,
        instructor: group.instructor,
      },
    });
  } catch (error) {
    console.error("Error fetching courses by group:", error);
    res.status(500).json({ message: "Failed to get courses by group" });
  }
};
export const createCourseInstructor = async (req, res) => {
  try {
    const { name, email, bio, photoUrl } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // 1. UPLOAD PHOTO
    let instructorPhotoUrl = photoUrl || null;
    let photoPublicId = null;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, {
        folder: "edu/instructors",
      });
      instructorPhotoUrl = result.secure_url;
      photoPublicId = result.public_id;
    }

    // Build data object
    const instructorData = {
      name,
      email,
      bio,
    };

    // Add photo fields only if they are provided
    if (instructorPhotoUrl !== undefined && instructorPhotoUrl !== null)
      instructorData.photoUrl = instructorPhotoUrl;
    if (photoPublicId !== undefined && photoPublicId !== null)
      instructorData.photoPublicId = photoPublicId;

    const instructor = await prisma.instructor.create({
      data: instructorData,
    });
    res.json(instructor);
  } catch (error) {
    console.error("Error creating instructor:", error);
    res.status(500).json({ message: "Failed to create instructor" });
  }
};
export const updateCourseInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, bio, photoUrl } = req.body;

    // Check if instructor exists
    const existingInstructor = await prisma.instructor.findUnique({
      where: { id },
    });

    if (!existingInstructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // 1. UPLOAD PHOTO if new file is provided
    let instructorPhotoUrl = photoUrl || existingInstructor.photoUrl || null;
    let photoPublicId = existingInstructor.photoPublicId || null;
    let oldPhotoPublicId = existingInstructor.photoPublicId;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, {
        folder: "edu/instructors",
      });
      instructorPhotoUrl = result.secure_url;
      photoPublicId = result.public_id;

      // Delete old photo from Cloudinary if it exists
      if (oldPhotoPublicId) {
        try {
          await destroy(oldPhotoPublicId);
        } catch (error) {
          console.error("Error deleting old photo from Cloudinary:", error);
          // Continue even if deletion fails
        }
      }
    }

    // Build update data object
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (instructorPhotoUrl !== undefined && instructorPhotoUrl !== null)
      updateData.photoUrl = instructorPhotoUrl;
    if (photoPublicId !== undefined && photoPublicId !== null)
      updateData.photoPublicId = photoPublicId;

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const instructor = await prisma.instructor.update({
      where: { id },
      data: updateData,
    });
    res.json({ message: "Instructor updated successfully", instructor });
  } catch (error) {
    console.error("Error updating instructor:", error);
    res.status(500).json({ message: "Failed to update instructor" });
  }
};

export const deleteCourseInstructor = async (req, res) => {
  try {
    const { id } = req.params;

    // Get instructor to delete old photo
    const instructor = await prisma.instructor.findUnique({
      where: { id },
    });

    if (instructor && instructor.photoPublicId) {
      try {
        await destroy(instructor.photoPublicId);
      } catch (error) {
        console.error("Error deleting photo from Cloudinary:", error);
        // Continue even if deletion fails
      }
    }

    await prisma.instructor.delete({
      where: { id },
    });
    res.json({ message: "Instructor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete instructor" });
  }
};
export const getAllCourseInstructors = async (req, res) => {
  try {
    const instructors = await prisma.instructor.findMany();
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: "Failed to get instructors" });
  }
};
export const getCourseInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await prisma.instructor.findUnique({
      where: { id },
    });
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: "Failed to get instructor" });
  }
};
