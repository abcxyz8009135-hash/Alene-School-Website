import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import resultsRoutes from "./routes/results.js";
import newsRoutes from "./routes/news.js";
import authRoutes from "./routes/auth.js";
import programsRoutes from "./routes/programs.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN ||
  (process.env.NODE_ENV === "production"
    ? "https://alene-highschool-website.vercel.app"
    : "http://localhost:3000");

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "alene-hs-server" });
});

app.use("/api/results", resultsRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/programs", programsRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Alene HS API server running on http://localhost:${PORT}`);
});
