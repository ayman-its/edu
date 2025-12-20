import { Router } from "express";
import {
  createCourseGroup,
  deleteCourseGroup,
  getAllCourseGroups,
  getCourseGroupById,
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  createCourseInstructor,
  deleteCourseInstructor,
  getAllCourseInstructors,
  getCourseInstructorById,
} from "./course.controller.js";

const router = Router();

router.get("/course-groups", getAllCourseGroups);
router.get("/course-groups/:id", getCourseGroupById);
router.get("/course-instructors", getAllCourseInstructors);
router.get("/course-instructors/:id", getCourseInstructorById);
router.get("/courses", getAllCourses);
router.get("/courses/:id", getCourseById);

router.post("/course-groups", createCourseGroup);
router.post("/course-instructors", createCourseInstructor);
router.post("/course", createCourse);

router.delete("/course/:id", deleteCourse);
router.delete("/course-instructors/:id", deleteCourseInstructor);
router.delete("/course-groups/:id", deleteCourseGroup);
export default router;
