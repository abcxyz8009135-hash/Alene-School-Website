import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth";

const achievementSchema = z.object({
  programSlug: z.string().min(2, "Program slug is required."),
  category: z.enum(["stem-center", "hobbies"]),
  title: z.string().min(3, "Title is required."),
  description: z.string().min(3, "Description is required."),
  year: z.coerce.number().int().min(2000),
  metricLabel: z.string().optional().nullable(),
  metricValue: z.string().optional().nullable(),
});

export async function listAchievementsAdmin(_req: AuthenticatedRequest, res: Response) {
  try {
    const achievements = await prisma.programAchievement.findMany({
      orderBy: [{ programSlug: "asc" }, { year: "desc" }],
    });
    return res.status(200).json({ achievements });
  } catch (error) {
    console.error("Error listing program achievements:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function createAchievement(req: AuthenticatedRequest, res: Response) {
  const parsed = achievementSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input." });
  }

  try {
    const achievement = await prisma.programAchievement.create({ data: parsed.data });
    return res.status(201).json({ achievement });
  } catch (error) {
    console.error("Error creating achievement:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateAchievement(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const parsed = achievementSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input." });
  }

  try {
    const achievement = await prisma.programAchievement.update({
      where: { id },
      data: parsed.data,
    });
    return res.status(200).json({ achievement });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Achievement not found." });
    }
    console.error("Error updating achievement:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteAchievement(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  try {
    await prisma.programAchievement.delete({ where: { id } });
    return res.status(204).send();
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Achievement not found." });
    }
    console.error("Error deleting achievement:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
