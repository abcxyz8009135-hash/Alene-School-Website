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

// Base allowed origins
const allowedOrigins = [
  "https://alene-highschool-website.vercel.app",
  "http://localhost:3000",
];

// If process.env.CLIENT_ORIGIN is set in Render, clean and include it
if (process.env.CLIENT_ORIGIN) {
  const cleanEnvOrigin = process.env.CLIENT_ORIGIN.replace(/\/$/, "");
  if (!allowedOrigins.includes(cleanEnvOrigin)) {
    allowedOrigins.push(cleanEnvOrigin);
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Strip trailing slashes from incoming request origin header
      const normalizedOrigin = origin.replace(/\/$/, "");

      // Match against allowlist OR any Vercel preview URL (*.vercel.app)
      const isAllowed =
        allowedOrigins.includes(normalizedOrigin) ||
        /\.vercel\.app$/.test(normalizedOrigin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Blocked by CORS policy for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
  console.log(`Alene HS API server running on port ${PORT}`);
});