import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exam Results",
  description: "Check Alene High School entrance exam results online with your registration ID.",
};

export default function ExamResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
