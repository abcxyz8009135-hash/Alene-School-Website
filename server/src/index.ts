import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import resultsRoutes from "./routes/results.js";
import newsRoutes from "./routes/news.js";
import authRoutes from "./routes/auth.js";
import programsRoutes from "./routes/programs.js";
import adminRoutes from "./routes/admin.js";
import settingsRoutes from "./routes/settings.js";
import { corsOptions, describeCorsPolicy } from "./lib/cors.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Render sits behind a reverse proxy — without this, express-rate-limit
// either sees every request as coming from the proxy's single IP (rate
// limits everyone together) or throws on the X-Forwarded-For header.
app.set("trust proxy", 1);

app.use(cors(corsOptions));

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
app.use("/api/settings", settingsRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Alene HS API server running on port ${PORT}`);
  console.log(`CORS — ${describeCorsPolicy()}`);
});