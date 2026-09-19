import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

const programSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated."),
  category: z.enum(["stem-center", "hobbies"]),
  title: z.string().min(2, "Title is required."),
  imageUrl: z.string().url("A valid image URL is required."),
  summary: z.string().min(3, "Summary is required."),
  description: z.string().min(3, "Description is required."),
  curriculumHighlights: z.array(z.string().min(1)).min(1, "At least one highlight is required."),
  establishedYear: z.coerce.number().int().min(1900).max(2100),
});

export async function listProgramsAdmin(_req: AuthenticatedRequest, res: Response) {
  try {
    const programs = await prisma.program.findMany({ orderBy: { title: "asc" } });
    return res.status(200).json({ programs });
  } catch (error) {
    console.error("Error listing programs:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function createProgram(req: AuthenticatedRequest, res: Response) {
  const parsed = programSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input." });
  }

  try {
    const program = await prisma.program.create({ data: parsed.data });
    return res.status(201).json({ program });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "A program with this slug already exists." });
    }
    console.error("Error creating program:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateProgram(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const parsed = programSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input." });
  }

  try {
    const program = await prisma.program.update({ where: { id }, data: parsed.data });
    return res.status(200).json({ program });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Program not found." });
    }
    console.error("Error updating program:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteProgram(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  try {
    await prisma.program.delete({ where: { id } });
    return res.status(204).send();
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Program not found." });
    }
    console.error("Error deleting program:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
