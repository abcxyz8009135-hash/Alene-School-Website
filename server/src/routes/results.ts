import { Router } from "express";
import { getResultByRegistrationId } from "../controllers/resultsController";

const router = Router();

router.get("/:registrationId", getResultByRegistrationId);

export default router;
