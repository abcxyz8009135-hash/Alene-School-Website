import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SCHOOL_NAME } from "@/lib/constants";
import { fetchSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: `${SCHOOL_NAME}`,
  description:
    "Alene High School — Shaping tomorrow's leaders through excellence in education, science, technology, and character.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await fetchSettings();

  return (
    <html lang="en">
      <body>
        <Navbar settings={settings} />
        <main className="min-h-screen">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
