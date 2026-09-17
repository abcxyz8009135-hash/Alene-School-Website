import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { getDashboardStats } from "../controllers/adminController";
import {
  createNews,
  deleteNews,
  listNewsAdmin,
  updateNews,
} from "../controllers/adminNewsController";
import {
  createResult,
  deleteResult,
  listResultsAdmin,
  updateResult,
} from "../controllers/adminResultsController";
import {
  createAchievement,
  deleteAchievement,
  listAchievementsAdmin,
  updateAchievement,
} from "../controllers/adminProgramsController";

const router = Router();

// Every admin route requires a valid JWT belonging to an admin user.
router.use(requireAuth, requireAdmin);

router.get("/stats", getDashboardStats);

router.get("/news", listNewsAdmin);
router.post("/news", createNews);
router.put("/news/:id", updateNews);
router.delete("/news/:id", deleteNews);

router.get("/results", listResultsAdmin);
router.post("/results", createResult);
router.put("/results/:id", updateResult);
router.delete("/results/:id", deleteResult);

router.get("/achievements", listAchievementsAdmin);
router.post("/achievements", createAchievement);
router.put("/achievements/:id", updateAchievement);
router.delete("/achievements/:id", deleteAchievement);

export default router;
