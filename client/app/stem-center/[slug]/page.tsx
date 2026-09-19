import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProgramDetail from "@/components/ProgramDetail";
import { fetchAchievements, fetchProgramBySlug, fetchProgramsByCategory } from "@/lib/programs";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const programs = await fetchProgramsByCategory("stem-center");
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const program = await fetchProgramBySlug("stem-center", params.slug);
  return {
    title: program ? `${program.title} — STEM Center` : "STEM Program",
    description: program?.summary,
  };
}

export default async function StemProgramDetailPage({ params }: PageProps) {
  const program = await fetchProgramBySlug("stem-center", params.slug);
  if (!program) notFound();

  const achievements = await fetchAchievements(program.slug);

  return <ProgramDetail program={program} achievements={achievements} />;
}
