import { Router } from "express";
import { getProgramAchievements, listPrograms } from "../controllers/programsController.js";

const router = Router();

router.get("/", listPrograms);
router.get("/:slug", getProgramAchievements);

export default router;
