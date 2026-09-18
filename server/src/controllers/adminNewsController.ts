import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

const newsSchema = z.object({
  title: z.string().min(3, "Title is required."),
  slug: z
    .string()
    .min(3, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated."),
  excerpt: z.string().min(3, "Excerpt is required."),
  content: z.string().min(3, "Content is required."),
  category: z.string().min(2, "Category is required."),
  imageUrl: z.string().url("A valid image URL is required."),
  publishedAt: z.coerce.date().optional(),
});

export async function listNewsAdmin(_req: AuthenticatedRequest, res: Response) {
  try {
    const articles = await prisma.newsArticle.findMany({ orderBy: { publishedAt: "desc" } });
    return res.status(200).json({ articles });
  } catch (error) {
    console.error("Error listing news:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function createNews(req: AuthenticatedRequest, res: Response) {
  const parsed = newsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input." });
  }

  try {
    const article = await prisma.newsArticle.create({ data: parsed.data });
    return res.status(201).json({ article });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "An article with this slug already exists." });
    }
    console.error("Error creating news article:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateNews(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const parsed = newsSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input." });
  }

  try {
    const article = await prisma.newsArticle.update({ where: { id }, data: parsed.data });
    return res.status(200).json({ article });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Article not found." });
    }
    console.error("Error updating news article:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteNews(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  try {
    await prisma.newsArticle.delete({ where: { id } });
    return res.status(204).send();
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Article not found." });
    }
    console.error("Error deleting news article:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
