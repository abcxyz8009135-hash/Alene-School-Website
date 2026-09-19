import { Router } from "express";
import { changePassword, login, me, requestAccess } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { formRateLimit, loginRateLimit } from "../middleware/rateLimit.js";

const router = Router();

// Public self-registration is intentionally not exposed — all student/teacher
// accounts must go through the request-access -> admin approval flow so an
// admin controls who gets portal access. See adminAccessRequestController.

router.post("/login", loginRateLimit, login);
router.post("/request-access", formRateLimit, requestAccess);
router.post("/change-password", requireAuth, formRateLimit, changePassword);
router.get("/me", requireAuth, me);

export default router;
