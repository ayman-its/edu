import { Router } from "express";
import multer from "multer";
import {
  createCourseGroup,
  deleteCourseGroup,
  getAllCourseGroups,
  getCourseGroupById,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCoursesByGroupId,
  createCourseInstructor,
  updateCourseInstructor,
  deleteCourseInstructor,
  getAllCourseInstructors,
  getCourseInstructorById,
} from "./course.controller.js";

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.get("/course-groups", getAllCourseGroups);
router.get("/course-groups/:id", getCourseGroupById);
router.get("/course-instructors", getAllCourseInstructors);
router.get("/course-instructors/:id", getCourseInstructorById);
router.get("/courses", getAllCourses);
router.get("/courses/group/:groupId", getCoursesByGroupId);
router.get("/courses/:id", getCourseById);

router.post("/course-groups", createCourseGroup);
router.post(
  "/course-instructors",
  upload.single("photo"),
  createCourseInstructor
);
router.post("/course", upload.single("course_photo"), createCourse);
router.put("/course/:id", upload.single("course_photo"), updateCourse);
router.put(
  "/course-instructors/:id",
  upload.single("photo"),
  updateCourseInstructor
);

router.delete("/course/:id", deleteCourse);
router.delete("/course-instructors/:id", deleteCourseInstructor);
router.delete("/course-groups/:id", deleteCourseGroup);
export default router;
