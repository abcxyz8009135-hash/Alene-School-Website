import { API_BASE_URL, CONTACT_INFO, PHOTOS, SCHOOL_MOTTO, SCHOOL_NAME, SCHOOL_SHORT_NAME } from "./constants";

export interface SiteSettings {
  schoolName: string;
  schoolShortName: string;
  schoolMotto: string;
  logoUrl: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactHours: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;

  homeHeroImage: string;
  homeAcademicsImage: string;
  homeStemImage: string;
  homeAchievementImage: string;
  homeCommunityImage1: string;
  homeCommunityImage2: string;

  aboutHeroImage: string;
  /** Hero image for the Community page (key kept from the former Hobbies page). */
  hobbiesHeroImage: string;
  stemHeroImage: string;

  stemGalleryImage1: string;
  stemGalleryImage2: string;
  stemGalleryImage3: string;
  stemGalleryImage4: string;
  stemGalleryImage5: string;
  stemGalleryImage6: string;

  aboutHistoryParagraph1: string;
  aboutHistoryParagraph2: string;
  aboutMission: string;
  aboutVision: string;

  coreValue1Title: string;
  coreValue1Description: string;
  coreValue2Title: string;
  coreValue2Description: string;
  coreValue3Title: string;
  coreValue3Description: string;
  coreValue4Title: string;
  coreValue4Description: string;

  principalName: string;
  principalTitle: string;
  principalQuote: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  schoolName: SCHOOL_NAME,
  schoolShortName: SCHOOL_SHORT_NAME,
  schoolMotto: SCHOOL_MOTTO,
  logoUrl: "/logo.jpg",
  contactAddress: CONTACT_INFO.address,
  contactPhone: CONTACT_INFO.phone,
  contactEmail: CONTACT_INFO.email,
  contactHours: CONTACT_INFO.hours,
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",

  homeHeroImage: PHOTOS.labPractical,
  homeAcademicsImage: PHOTOS.assembly,
  homeStemImage: PHOTOS.roboticsProject,
  homeAchievementImage: PHOTOS.roboticsAward,
  homeCommunityImage1: PHOTOS.cleanup,
  homeCommunityImage2: PHOTOS.painting,

  aboutHeroImage: PHOTOS.assembly,
  hobbiesHeroImage: PHOTOS.painting,
  stemHeroImage: PHOTOS.microscope,

  stemGalleryImage1: PHOTOS.roboticsProject,
  stemGalleryImage2: PHOTOS.microscope,
  stemGalleryImage3: PHOTOS.labPractical,
  stemGalleryImage4: PHOTOS.roboticsAward,
  stemGalleryImage5: "",
  stemGalleryImage6: "",

  aboutHistoryParagraph1:
    "Alene High School was founded with a singular purpose: to provide accessible, high-quality education that prepares students for the challenges of a rapidly changing world. Since our founding, we have grown from a small campus into a vibrant learning community serving hundreds of students.",
  aboutHistoryParagraph2:
    "Over the years, we have expanded our academic offerings, built a dedicated STEM Center, and cultivated a culture of excellence in academics, arts, and athletics. Today, Alene High School stands as a trusted institution known for producing well-rounded, capable graduates.",
  aboutMission:
    "To provide a nurturing and rigorous learning environment that empowers students with the knowledge, skills, and character needed to excel academically and contribute meaningfully to society.",
  aboutVision:
    "To be a leading institution recognized for academic excellence, innovation in science and technology, and the holistic development of every student we serve.",

  coreValue1Title: "Academic Excellence",
  coreValue1Description: "We hold high standards for learning and continuous improvement.",
  coreValue2Title: "Integrity",
  coreValue2Description: "We act honestly and take responsibility for our actions.",
  coreValue3Title: "Respect",
  coreValue3Description: "We value every individual's dignity, background, and perspective.",
  coreValue4Title: "Innovation",
  coreValue4Description: "We embrace creativity and forward-thinking solutions.",

  principalName: "Mr. Abel Hailermariam Meles",
  principalTitle: "Principal, Alene High School",
  principalQuote:
    "At Alene High School, we believe every student holds untapped potential. Our role is to provide the guidance, resources, and environment necessary for that potential to flourish — academically, socially, and personally. We are proud of our students, our dedicated staff, and the community that supports us every step of the way.",
};

/**
 * Values written to the database by the original seed script. They were
 * template placeholders (stock photos, an incorrect address and motto, demo
 * contact details), so they are treated as "not set" and the defaults above
 * are used instead. Anything an admin has actually edited is kept.
 */
const LEGACY_PLACEHOLDER_VALUES = new Set([
  "Knowledge. Character. Innovation.",
  "Alene Sub-City, Addis Ababa, Ethiopia",
  "+251 11 234 5678",
  "info@alenehs.edu.et",
  "Mon - Fri, 8:00 AM - 4:30 PM",
  "Dr. Meseret Alemu",
]);

function isLegacyPlaceholder(value: string) {
  return LEGACY_PLACEHOLDER_VALUES.has(value) || value.startsWith("https://images.unsplash.com/");
}

/**
 * Fetches admin-managed site settings, falling back to the defaults above for
 * any key that hasn't been set yet (or if the API is unreachable).
 */
export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Settings request failed");
    const data = await res.json();
    const settings = (data.settings || {}) as Record<string, string>;

    const merged = { ...DEFAULT_SETTINGS };
    for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
      const value = settings[key];
      if (value && !isLegacyPlaceholder(value)) merged[key] = value;
    }
    return merged;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
