import { Response } from "express";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth";

export async function getDashboardStats(_req: AuthenticatedRequest, res: Response) {
  try {
    const [newsCount, resultsCount, achievementsCount, usersCount, passCount] =
      await Promise.all([
        prisma.newsArticle.count(),
        prisma.examResult.count(),
        prisma.programAchievement.count(),
        prisma.user.count(),
        prisma.examResult.count({ where: { status: "PASS" } }),
      ]);

    return res.status(200).json({
      stats: {
        newsCount,
        resultsCount,
        achievementsCount,
        usersCount,
        passCount,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
