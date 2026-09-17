import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProgramDetail from "@/components/ProgramDetail";
import { fetchAchievements, getProgramBySlug, getProgramsByCategory } from "@/lib/programs";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getProgramsByCategory("stem-center").map((program) => ({
    slug: program.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const program = getProgramBySlug("stem-center", params.slug);
  return {
    title: program ? `${program.title} — STEM Center` : "STEM Program",
    description: program?.summary,
  };
}

export default async function StemProgramDetailPage({ params }: PageProps) {
  const program = getProgramBySlug("stem-center", params.slug);
  if (!program) notFound();

  const achievements = await fetchAchievements(program.slug);

  return <ProgramDetail program={program} achievements={achievements} />;
}
