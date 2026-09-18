import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getResultByRegistrationId(req: Request, res: Response) {
  const { registrationId } = req.params;

  if (!registrationId || registrationId.trim().length === 0) {
    return res.status(400).json({ message: "Registration ID is required." });
  }

  try {
    const result = await prisma.examResult.findUnique({
      where: { registrationId: registrationId.trim().toUpperCase() },
    });

    if (!result) {
      return res.status(404).json({
        message: "No result found for this registration ID.",
      });
    }

    return res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching exam result:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
