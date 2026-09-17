import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SCHOOL_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SCHOOL_NAME}`,
  description:
    "Alene High School — Shaping tomorrow's leaders through excellence in education, science, technology, and character.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
