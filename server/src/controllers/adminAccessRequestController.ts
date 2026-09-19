import { Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

export async function listAccessRequests(_req: AuthenticatedRequest, res: Response) {
  try {
    const requests = await prisma.accessRequest.findMany({ orderBy: { createdAt: "desc" } });
    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Error listing access requests:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

const approveSchema = z.object({
  temporaryPassword: z.string().min(6, "Temporary password must be at least 6 characters."),
});

export async function approveAccessRequest(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const parsed = approveSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input." });
  }

  try {
    const request = await prisma.accessRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ message: "Access request not found." });
    }
    if (request.status !== "PENDING") {
      return res.status(409).json({ message: "This request has already been resolved." });
    }

    const existing = await prisma.user.findUnique({ where: { email: request.email } });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashed = await bcrypt.hash(parsed.data.temporaryPassword, 10);

    const [user] = await prisma.$transaction([
      prisma.user.create({
        data: {
          fullName: request.fullName,
          email: request.email,
          password: hashed,
          role: request.role,
        },
      }),
      prisma.accessRequest.update({ where: { id }, data: { status: "APPROVED" } }),
    ]);

    return res.status(201).json({
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Error approving access request:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function rejectAccessRequest(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  try {
    const request = await prisma.accessRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ message: "Access request not found." });
    }
    if (request.status !== "PENDING") {
      return res.status(409).json({ message: "This request has already been resolved." });
    }

    await prisma.accessRequest.update({ where: { id }, data: { status: "REJECTED" } });
    return res.status(200).json({ message: "Request rejected." });
  } catch (error) {
    console.error("Error rejecting access request:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
