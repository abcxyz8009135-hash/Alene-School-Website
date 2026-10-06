import { Router } from "express";
import { changePassword, login, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { formRateLimit, loginRateLimit } from "../middleware/rateLimit.js";

const router = Router();

// Public self-registration is intentionally not exposed. Student/teacher
// portal accounts live in the separate school management system.

router.post("/login", loginRateLimit, login);
router.post("/change-password", requireAuth, formRateLimit, changePassword);
router.get("/me", requireAuth, me);

export default router;
