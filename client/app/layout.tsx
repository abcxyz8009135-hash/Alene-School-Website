import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PHOTOS, SCHOOL_NAME, SITE_URL } from "@/lib/constants";
import { fetchSettings } from "@/lib/settings";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

const DESCRIPTION =
  "Alene High School is a public high school in Semen Sub-City, Mekelle, Ethiopia — building a culture of science, STEM learning, academic excellence and community service.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SCHOOL_NAME} | Semen Sub-City, Mekelle`,
    template: `%s | ${SCHOOL_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SCHOOL_NAME,
  keywords: [
    "Alene High School",
    "Mekelle",
    "Semen Sub-City",
    "public high school",
    "Ethiopia",
    "STEM",
    "science education",
  ],
  openGraph: {
    type: "website",
    siteName: SCHOOL_NAME,
    title: `${SCHOOL_NAME} | Semen Sub-City, Mekelle`,
    description: DESCRIPTION,
    images: [{ url: PHOTOS.labPractical, width: 1280, height: 720, alt: "Alene students in a laboratory practical" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SCHOOL_NAME} | Semen Sub-City, Mekelle`,
    description: DESCRIPTION,
    images: [PHOTOS.labPractical],
  },
};

export const viewport: Viewport = {
  themeColor: "#A71930",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await fetchSettings();

  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide scroll-reveal content only when JS can reveal it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar settings={settings} />
        <main id="main" className="min-h-[60vh]">
          {children}
        </main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
