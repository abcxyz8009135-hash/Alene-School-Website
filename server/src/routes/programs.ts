import { Router } from "express";
import { getProgramAchievements } from "../controllers/programsController";

const router = Router();

router.get("/:slug", getProgramAchievements);

export default router;
