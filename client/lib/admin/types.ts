import type { ProgramCategory } from "@/lib/types";

/** Program record as returned by /api/admin/programs. */
export interface AdminProgram {
  id: string;
  slug: string;
  category: ProgramCategory;
  title: string;
  imageUrl: string;
  summary: string;
  description: string;
  curriculumHighlights: string[];
  establishedYear: number;
  updatedAt?: string;
}
