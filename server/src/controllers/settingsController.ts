import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getSettings(_req: Request, res: Response) {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return res.status(200).json({ settings: map });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
