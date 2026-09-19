import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

const updateSettingsSchema = z.record(z.string(), z.string());

export async function updateSettings(req: AuthenticatedRequest, res: Response) {
  const parsed = updateSettingsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Body must be a key-value map of strings." });
  }

  try {
    const entries = Object.entries(parsed.data);

    // Upserts run sequentially rather than inside a single $transaction:
    // this form can send a couple dozen keys at once, and holding one
    // pooled connection open across all of them is more fragile on
    // Supabase's pgbouncer pooler than each upsert grabbing its own
    // connection. Losing atomicity here is an acceptable tradeoff for a
    // low-stakes key-value settings bag.
    for (const [key, value] of entries) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return res.status(200).json({ settings: map });
  } catch (error) {
    console.error("Error updating site settings:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
