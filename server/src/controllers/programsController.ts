import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getProgramAchievements(req: Request, res: Response) {
  const { slug } = req.params;

  if (!slug || slug.trim().length === 0) {
    return res.status(400).json({ message: "Program slug is required." });
  }

  try {
    const achievements = await prisma.programAchievement.findMany({
      where: { programSlug: slug.trim() },
      orderBy: { year: "desc" },
    });

    return res.status(200).json({ slug, achievements });
  } catch (error) {
    console.error("Error fetching program achievements:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
