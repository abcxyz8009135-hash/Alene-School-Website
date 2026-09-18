import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

const resultSchema = z.object({
  registrationId: z.string().min(3, "Registration ID is required."),
  studentName: z.string().min(2, "Student name is required."),
  score: z.coerce.number().int().min(0, "Score must be zero or greater."),
  total: z.coerce.number().int().min(1, "Total must be greater than zero."),
  status: z.enum(["PASS", "FAIL", "PENDING"]),
  examYear: z.coerce.number().int().min(2000),
});

export async function listResultsAdmin(_req: AuthenticatedRequest, res: Response) {
  try {
    const results = await prisma.examResult.findMany({ orderBy: { createdAt: "desc" } });
    return res.status(200).json({ results });
  } catch (error) {
    console.error("Error listing exam results:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function createResult(req: AuthenticatedRequest, res: Response) {
  const parsed = resultSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input." });
  }

  try {
    const result = await prisma.examResult.create({
      data: {
        ...parsed.data,
        registrationId: parsed.data.registrationId.trim().toUpperCase(),
      },
    });
    return res.status(201).json({ result });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "This registration ID already exists." });
    }
    console.error("Error creating exam result:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateResult(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const parsed = resultSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input." });
  }

  const data = { ...parsed.data };
  if (data.registrationId) {
    data.registrationId = data.registrationId.trim().toUpperCase();
  }

  try {
    const result = await prisma.examResult.update({ where: { id }, data });
    return res.status(200).json({ result });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Exam result not found." });
    }
    console.error("Error updating exam result:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteResult(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  try {
    await prisma.examResult.delete({ where: { id } });
    return res.status(204).send();
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Exam result not found." });
    }
    console.error("Error deleting exam result:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
