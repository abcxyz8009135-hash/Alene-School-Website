import type { Metadata } from "next";
import ExamResultLookup from "@/components/ExamResultLookup";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return { title: c.text("seo.exam.title"), description: c.text("seo.exam.description") };
}

export default async function EntranceExamResultPage() {
  const c = await getContent();
  return (
    <ExamResultLookup
      copy={{
        eyebrow: c.text("exam.eyebrow"),
        headline: c.text("exam.headline"),
        intro: c.text("exam.intro"),
        hint: c.text("exam.hint"),
        help: c.text("exam.help"),
        helpLink: c.text("exam.helpLink"),
      }}
    />
  );
}
