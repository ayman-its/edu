import prisma from "../../config/prisma.js";

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
    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    // Build data object with only provided optional fields
    const courseData = {
      title,
      instructorId,
      groupId,
    };

    // Add optional fields only if they are provided
    if (coursePhotoUrl !== undefined)
      courseData.coursePhotoUrl = coursePhotoUrl;
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
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
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
export const createCourseInstructor = async (req, res) => {
  try {
    const { name, email, bio, photoUrl } = req.body;
    const instructor = await prisma.instructor.create({
      data: { name, email, bio, photoUrl },
    });
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: "Failed to create instructor" });
  }
};
export const deleteCourseInstructor = async (req, res) => {
  try {
    const { id } = req.params;
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
