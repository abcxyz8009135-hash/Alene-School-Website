import { Router } from "express";
import multer from "multer";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { getDashboardStats } from "../controllers/adminController.js";
import { uploadImage } from "../controllers/adminUploadController.js";
import {
  createNews,
  deleteNews,
  listNewsAdmin,
  updateNews,
} from "../controllers/adminNewsController.js";
import {
  createResult,
  deleteResult,
  listResultsAdmin,
  updateResult,
} from "../controllers/adminResultsController.js";
import {
  createAchievement,
  deleteAchievement,
  listAchievementsAdmin,
  updateAchievement,
} from "../controllers/adminProgramsController.js";
import {
  createProgram,
  deleteProgram,
  listProgramsAdmin,
  updateProgram,
} from "../controllers/adminProgramContentController.js";
import { updateSettings } from "../controllers/adminSettingsController.js";
import {
  approveAccessRequest,
  listAccessRequests,
  rejectAccessRequest,
} from "../controllers/adminAccessRequestController.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

// Every admin route requires a valid JWT belonging to an admin user.
router.use(requireAuth, requireAdmin);

router.get("/stats", getDashboardStats);

router.post("/upload", upload.single("file"), uploadImage);

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

router.get("/programs", listProgramsAdmin);
router.post("/programs", createProgram);
router.put("/programs/:id", updateProgram);
router.delete("/programs/:id", deleteProgram);

router.put("/settings", updateSettings);

router.get("/access-requests", listAccessRequests);
router.post("/access-requests/:id/approve", approveAccessRequest);
router.post("/access-requests/:id/reject", rejectAccessRequest);

export default router;
