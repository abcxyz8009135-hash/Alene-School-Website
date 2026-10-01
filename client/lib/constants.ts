export const SCHOOL_NAME = "Alene High School";
export const SCHOOL_SHORT_NAME = "Alene HS";
export const SCHOOL_MOTTO = "Excellence in science through collective effort";
export const SCHOOL_LOCATION = "Semen Sub-City, Mekelle, Ethiopia";

export const LOGO_PATH = "/logo.jpg";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://alene-highschool-website.vercel.app";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export const CONTACT_INFO = {
  address: SCHOOL_LOCATION,
  phone: "+251971190170",
  email: "registrar@alene.edu.et",
  // Left empty until the school confirms its office hours; the UI hides
  // empty contact fields.
  hours: "",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Academics", href: "/academics" },
  { label: "STEM", href: "/stem-center" },
  { label: "Community", href: "/community" },
  { label: "News", href: "/news" },
];

export const EXAM_RESULTS_LINK = { label: "Exam Results", href: "/entrance-exam-result" };

export const FOOTER_LINKS = [
  ...NAV_LINKS.filter((l) => l.href !== "/"),
  EXAM_RESULTS_LINK,
  { label: "Contact", href: "/contact-us" },
];

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
