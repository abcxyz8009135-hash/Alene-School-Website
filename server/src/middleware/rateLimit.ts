import rateLimit from "express-rate-limit";

// 10 attempts per 15 minutes per IP — enough for a real user who mistypes a
// password a few times, tight enough to make brute-forcing impractical.
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

// Looser limit for lower-risk endpoints that are still worth protecting
// from spam/abuse (access requests, password changes).
export const formRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});
