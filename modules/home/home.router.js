import { Router } from "express";
import {
  createCourseGroup,

} from "./course.controller.js";

const router = Router();

router.get("/", getHome);


export default router;
