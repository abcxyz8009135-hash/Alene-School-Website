import { Router } from "express";
import { getResultByRegistrationId } from "../controllers/resultsController.js";

const router = Router();

router.get("/:registrationId", getResultByRegistrationId);

export default router;
