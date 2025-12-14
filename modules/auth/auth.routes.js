import { Router } from "express";
import {
  signupWithPassword,
  login,
  logout,
  requestPasswordReset,
  resetPassword,
} from "./auth.controller.js";

const router = Router();


router.post("/signup", signupWithPassword);
router.post("/login", login);
router.post("/logout", logout);
router.post("/password/request", requestPasswordReset);
router.post("/password/reset", resetPassword);

export default router;
