import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HideOnAdmin from "@/components/HideOnAdmin";
import { PHOTOS, SITE_URL } from "@/lib/constants";
import { buildNavigation, getContent } from "@/lib/content";
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

export async function generateMetadata(): Promise<Metadata> {
  const [c, settings] = await Promise.all([getContent(), fetchSettings()]);
  const title = c.text("seo.siteTitle");
  const description = c.text("seo.siteDescription");
  const image = settings.seoShareImage || PHOTOS.labPractical;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${settings.schoolName}` },
    description,
    applicationName: settings.schoolName,
    keywords: [settings.schoolName, "Mekelle", "Semen Sub-City", "public high school", "Ethiopia", "STEM", "science education"],
    openGraph: {
      type: "website",
      siteName: settings.schoolName,
      title,
      description,
      images: [{ url: image, alt: settings.schoolName }],
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export const viewport: Viewport = {
  themeColor: "#A71930",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, content] = await Promise.all([fetchSettings(), getContent()]);
  const nav = buildNavigation(content);

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
        <Navbar settings={settings} nav={nav} />
        <main id="main" className="min-h-[60vh]">
          {children}
        </main>
        <HideOnAdmin>
          <Footer settings={settings} nav={nav} content={content} />
        </HideOnAdmin>
      </body>
    </html>
  );
}
