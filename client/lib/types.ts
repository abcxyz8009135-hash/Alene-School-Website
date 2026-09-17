export type ExamStatus = "PASS" | "FAIL" | "PENDING";

export interface ExamResult {
  id: string;
  registrationId: string;
  studentName: string;
  score: number;
  total: number;
  status: ExamStatus;
  examYear: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
}

export type ProgramCategory = "stem-center" | "hobbies";

export interface Program {
  slug: string;
  category: ProgramCategory;
  title: string;
  summary: string;
  description: string;
  imageSrc: string;
  curriculumHighlights: string[];
  establishedYear: number;
}

export interface ProgramAchievement {
  id: string;
  programSlug: string;
  category: ProgramCategory;
  title: string;
  description: string;
  year: number;
  metricLabel?: string | null;
  metricValue?: string | null;
}
