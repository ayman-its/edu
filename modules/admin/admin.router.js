import { Router } from "express";
import { promoteToAdmin } from "./admin.controller.js";
import { attachUser } from "../auth/auth.middleware.js";

const router = Router();

router.post("/promote", attachUser, promoteToAdmin);

export default router;

