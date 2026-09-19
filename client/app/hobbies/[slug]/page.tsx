import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProgramDetail from "@/components/ProgramDetail";
import { fetchAchievements, fetchProgramBySlug, fetchProgramsByCategory } from "@/lib/programs";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const programs = await fetchProgramsByCategory("hobbies");
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const program = await fetchProgramBySlug("hobbies", params.slug);
  return {
    title: program ? `${program.title} — Hobbies & Co-Curriculars` : "Hobbies Program",
    description: program?.summary,
  };
}

export default async function HobbiesProgramDetailPage({ params }: PageProps) {
  const program = await fetchProgramBySlug("hobbies", params.slug);
  if (!program) notFound();

  const achievements = await fetchAchievements(program.slug);

  return <ProgramDetail program={program} achievements={achievements} />;
}
