import {
  ABOUT_HERO_IMAGE,
  API_BASE_URL,
  CONTACT_INFO,
  HERO_IMG_1,
  HERO_SLIDES,
  HOBBIES_HERO_IMAGE,
  SCHOOL_MOTTO,
  SCHOOL_NAME,
  SCHOOL_SHORT_NAME,
  STEM_GALLERY_IMAGES,
  STEM_HERO_IMAGE,
} from "./constants";

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

  heroSlide1Image: string;
  heroSlide1Title: string;
  heroSlide1Subtitle: string;
  heroSlide2Image: string;
  heroSlide2Title: string;
  heroSlide2Subtitle: string;
  heroSlide3Image: string;
  heroSlide3Title: string;
  heroSlide3Subtitle: string;

  homeStemImage: string;
  aboutHeroImage: string;
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

const DEFAULT_SETTINGS: SiteSettings = {
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

  heroSlide1Image: HERO_SLIDES[0].image,
  heroSlide1Title: HERO_SLIDES[0].title,
  heroSlide1Subtitle: HERO_SLIDES[0].subtitle,
  heroSlide2Image: HERO_SLIDES[1].image,
  heroSlide2Title: HERO_SLIDES[1].title,
  heroSlide2Subtitle: HERO_SLIDES[1].subtitle,
  heroSlide3Image: HERO_SLIDES[2].image,
  heroSlide3Title: HERO_SLIDES[2].title,
  heroSlide3Subtitle: HERO_SLIDES[2].subtitle,

  homeStemImage: HERO_IMG_1,
  aboutHeroImage: ABOUT_HERO_IMAGE,
  hobbiesHeroImage: HOBBIES_HERO_IMAGE,
  stemHeroImage: STEM_HERO_IMAGE,

  stemGalleryImage1: STEM_GALLERY_IMAGES[0],
  stemGalleryImage2: STEM_GALLERY_IMAGES[1],
  stemGalleryImage3: STEM_GALLERY_IMAGES[2],
  stemGalleryImage4: STEM_GALLERY_IMAGES[3],
  stemGalleryImage5: STEM_GALLERY_IMAGES[4],
  stemGalleryImage6: STEM_GALLERY_IMAGES[5],

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

  principalName: "Dr. Meseret Alemu",
  principalTitle: "Principal, Alene High School",
  principalQuote:
    "At Alene High School, we believe every student holds untapped potential. Our role is to provide the guidance, resources, and environment necessary for that potential to flourish — academically, socially, and personally. We are proud of our students, our dedicated staff, and the community that supports us every step of the way.",
};

/**
 * Fetches admin-managed site settings, falling back to the static defaults
 * in lib/constants.ts for any key that hasn't been set yet (or if the API
 * is unreachable).
 */
export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Settings request failed");
    const data = await res.json();
    const settings = (data.settings || {}) as Record<string, string>;

    const merged = { ...DEFAULT_SETTINGS };
    for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
      if (settings[key]) merged[key] = settings[key];
    }
    return merged;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
