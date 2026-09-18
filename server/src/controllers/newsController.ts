import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getNews(req: Request, res: Response) {
  const { category, search } = req.query as { category?: string; search?: string };

  try {
    const articles = await prisma.newsArticle.findMany({
      where: {
        AND: [
          category && category !== "All" ? { category } : {},
          search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { excerpt: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
      orderBy: { publishedAt: "desc" },
    });

    return res.status(200).json({ articles });
  } catch (error) {
    console.error("Error fetching news:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getNewsBySlug(req: Request, res: Response) {
  const { slug } = req.params;

  try {
    const article = await prisma.newsArticle.findUnique({ where: { slug } });

    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }

    return res.status(200).json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
