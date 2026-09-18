import { Router } from "express";
import { getProgramAchievements } from "../controllers/programsController.js";

const router = Router();

router.get("/:slug", getProgramAchievements);

export default router;
