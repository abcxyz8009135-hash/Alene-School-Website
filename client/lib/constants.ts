export const SCHOOL_NAME = "Alene High School";
export const SCHOOL_SHORT_NAME = "Alene HS";
export const SCHOOL_MOTTO = "Excellence in science through collective effort";
export const SCHOOL_LOCATION = "Semen Sub-City, Mekelle, Ethiopia";

export const LOGO_PATH = "/logo.jpg";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://alene-highschool-website.vercel.app";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

/** The school management system (separate app) that the "Portal" link opens. */
export const PORTAL_URL =
  process.env.NEXT_PUBLIC_PORTAL_URL || "https://scripts-and-fullstack-apps-6az8.vercel.app";

export const CONTACT_INFO = {
  address: SCHOOL_LOCATION,
  phone: "+251971190170",
  email: "registrar@alene.edu.et",
  // Left empty until the school confirms its office hours; the UI hides
  // empty contact fields.
  hours: "",
};

/**
 * Site navigation. Destinations are fixed here; the labels are editable in
 * Admin → Site → Navigation & footer (see lib/contentRegistry.ts).
 */
export const NAV_ITEMS = [
  { key: "nav.home", href: "/" },
  { key: "nav.about", href: "/about-us" },
  { key: "nav.academics", href: "/academics" },
  { key: "nav.stem", href: "/stem-center" },
  { key: "nav.community", href: "/community" },
  { key: "nav.news", href: "/news" },
] as const;

export const EXAM_RESULTS_HREF = "/entrance-exam-result";
export const CONTACT_HREF = "/contact-us";

/** Real photographs of Alene students and school life, stored in /public/images. */
export const PHOTOS = {
  labPractical: "/images/lab-practical.jpg",
  microscope: "/images/microscope-lesson.jpg",
  roboticsProject: "/images/robotics-project.jpg",
  roboticsAward: "/images/robotics-award.jpg",
  assembly: "/images/morning-assembly.jpg",
  cleanup: "/images/campus-cleanup.jpg",
  painting: "/images/community-painting.jpg",
};

/** Maps a program category (as stored in the database) to its public route. */
export const CATEGORY_ROUTE: Record<"stem-center" | "hobbies", string> = {
  "stem-center": "/stem-center",
  hobbies: "/community",
};

export const CATEGORY_LABEL: Record<"stem-center" | "hobbies", string> = {
  "stem-center": "STEM",
  hobbies: "Community & Clubs",
};
