import { Router } from "express";
import { getNews, getNewsBySlug } from "../controllers/newsController.js";

const router = Router();

router.get("/", getNews);
router.get("/:slug", getNewsBySlug);

export default router;
