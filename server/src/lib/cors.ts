import type { CorsOptions } from "cors";

const isProduction = process.env.NODE_ENV === "production";

function normalize(origin: string) {
  return origin.trim().replace(/\/+$/, "").toLowerCase();
}

/**
 * Exact origins allowed in every environment. Configure with CLIENT_ORIGINS
 * (comma-separated); the older single-value CLIENT_ORIGIN is still honoured.
 */
const allowedOrigins = new Set(
  [
    "https://alene-highschool-website.vercel.app",
    ...(process.env.CLIENT_ORIGINS ?? "").split(","),
    process.env.CLIENT_ORIGIN ?? "",
  ]
    .map(normalize)
    .filter(Boolean)
);

/**
 * Vercel preview deployments of this project only, e.g.
 *   https://alene-highschool-website-git-feature-x-team.vercel.app
 *   https://alene-highschool-website-abc123-team.vercel.app
 * Set VERCEL_PROJECT_NAME if the Vercel project is renamed, or
 * ALLOW_VERCEL_PREVIEWS=false to turn previews off.
 */
const vercelProject = (process.env.VERCEL_PROJECT_NAME || "alene-highschool-website").toLowerCase();
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS !== "false";
const vercelPreviewPattern = new RegExp(
  `^https://${vercelProject.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-[a-z0-9-]+\\.vercel\\.app$`
);

// Any port on localhost, so the client still works when Next.js falls back
// from :3000 to :3001, :3002, ... Development only.
const localhostPattern = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function isAllowedOrigin(origin: string) {
  const o = normalize(origin);
  if (allowedOrigins.has(o)) return true;
  if (allowVercelPreviews && vercelPreviewPattern.test(o)) return true;
  if (!isProduction && localhostPattern.test(o)) return true;
  return false;
}

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Non-browser requests (curl, server-to-server, Next.js server
    // components) send no Origin header and aren't subject to CORS.
    if (!origin) return callback(null, true);

    if (isAllowedOrigin(origin)) return callback(null, true);

    // Answer without CORS headers so the browser blocks the response,
    // instead of throwing and turning every blocked preflight into a 500.
    console.warn(`CORS: blocked request from origin ${origin}`);
    return callback(null, false);
  },
  // Auth uses a bearer token in the Authorization header, not cookies.
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 600,
};

export function describeCorsPolicy() {
  return [
    `origins: ${[...allowedOrigins].join(", ") || "(none)"}`,
    allowVercelPreviews ? `Vercel previews: ${vercelProject}-*.vercel.app` : "Vercel previews: off",
    isProduction ? "localhost: blocked (production)" : "localhost: any port (development)",
  ].join(" | ");
}
