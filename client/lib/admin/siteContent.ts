/**
 * Admin → Site layout. Two kinds of field live here:
 *  - registry fields (website copy) from lib/contentRegistry.ts, which carry a
 *    default and can be reset;
 *  - setting fields (images, branding, contact) read through lib/settings.ts.
 * Both are stored through the same key/value settings API.
 */
import { CONTENT, serializeDefault, type ContentField, type ContentKey, type ListItemField } from "@/lib/contentRegistry";

export type SettingFieldType = "text" | "textarea" | "image" | "url" | "toggle" | "list";

export interface SettingField {
  key: string;
  label: string;
  type: SettingFieldType;
  placeholder?: string;
  hint?: string;
  /** Stored-string default for registry fields; undefined for plain settings. */
  defaultValue?: string;
  list?: { itemLabel: string; item: ListItemField[]; min?: number; max?: number };
}

export interface SettingGroup {
  id: string;
  title: string;
  description?: string;
  fields: SettingField[];
}

export type SiteSection = "home" | "pages" | "navigation" | "seo" | "settings";

export interface SiteContentPage {
  slug: string;
  title: string;
  section: SiteSection;
  description: string;
  preview?: { label: string; href: string };
  groups: SettingGroup[];
}

/** A website-copy field from the content registry. */
function c(key: ContentKey, overrides: Partial<SettingField> = {}): SettingField {
  const field: ContentField = CONTENT[key];
  const base: SettingField = {
    key,
    label: field.label,
    type: field.kind,
    hint: field.hint,
    defaultValue: serializeDefault(field),
  };
  if (field.kind === "list") {
    base.list = { itemLabel: field.itemLabel, item: field.item, min: field.min, max: field.max };
  }
  return { ...base, ...overrides };
}

/** An image setting (photos are shared with lib/settings.ts defaults). */
function img(key: string, label: string, hint = "Leave empty to use the school's default photo."): SettingField {
  return { key, label, type: "image", hint };
}

export const SITE_CONTENT_PAGES: SiteContentPage[] = [
  /* ------------------------------------------------------------ Home */
  {
    slug: "homepage",
    title: "Homepage",
    section: "home",
    description: "Every section of the home page, from the hero to the exam results box.",
    preview: { label: "View home page", href: "/" },
    groups: [
      {
        id: "home-hero",
        title: "01 · Hero",
        fields: [
          c("home.hero.eyebrow"),
          c("home.hero.headline"),
          c("home.hero.headlineAccent"),
          c("home.hero.body"),
          c("home.hero.primaryCta"),
          c("home.hero.secondaryCta"),
          c("home.hero.resultsLink"),
          c("home.hero.facts"),
          c("home.hero.caption"),
          img("homeHeroImage", "Hero photograph"),
        ],
      },
      {
        id: "home-motto",
        title: "02 · What we believe",
        fields: [c("home.motto.eyebrow"), c("home.motto.line1"), c("home.motto.line2"), c("home.motto.body"), c("home.pillars")],
      },
      {
        id: "home-academics",
        title: "03 · How we learn",
        description: "Subject areas and teaching points are edited on the Academics page and shown here too.",
        fields: [
          c("home.academics.eyebrow"),
          c("home.academics.title"),
          c("home.academics.intro"),
          c("home.academics.button"),
          img("homeAcademicsImage", "Section photograph"),
        ],
      },
      {
        id: "home-stem",
        title: "04 · STEM",
        fields: [
          c("home.stem.eyebrow"),
          c("home.stem.headline"),
          c("home.stem.headlineAccent"),
          c("home.stem.body"),
          c("home.stem.button"),
          c("home.stem.items"),
          img("homeStemImage", "Large photograph"),
        ],
      },
      {
        id: "home-achievements",
        title: "05 · Student achievements",
        description: "The achievements themselves are managed under Content → Achievements.",
        fields: [
          c("home.achievements.eyebrow"),
          c("home.achievements.title"),
          c("home.achievements.intro"),
          c("home.achievements.slots"),
          img("homeAchievementImage", "Featured photograph"),
        ],
      },
      {
        id: "home-community",
        title: "06 · Beyond the classroom",
        fields: [
          c("home.community.eyebrow"),
          c("home.community.headline"),
          c("home.community.body"),
          c("home.community.themes"),
          c("home.community.button"),
          c("home.community.caption"),
          img("homeCommunityImage1", "Main photograph"),
          img("homeCommunityImage2", "Second photograph"),
        ],
      },
      {
        id: "home-news",
        title: "07 · Latest news",
        description: "Articles are managed under Content → News.",
        fields: [c("home.news.eyebrow"), c("home.news.title"), c("home.news.link")],
      },
      {
        id: "cta-results",
        title: "Exam results box",
        description: "Shown at the bottom of the home, About and Academics pages.",
        fields: [c("cta.results.eyebrow"), c("cta.results.title"), c("cta.results.body"), c("cta.results.button")],
      },
    ],
  },

  /* ----------------------------------------------------------- Pages */
  {
    slug: "about",
    title: "About",
    section: "pages",
    description: "The school's story, mission, values, crest and the principal's message.",
    preview: { label: "View About page", href: "/about-us" },
    groups: [
      {
        id: "about-header",
        title: "Header",
        fields: [c("about.eyebrow"), c("about.headline"), c("about.headlineAccent"), c("about.intro"), img("aboutHeroImage", "Header photograph")],
      },
      {
        id: "about-story",
        title: "Story, mission & vision",
        fields: [
          c("about.history.eyebrow"),
          c("about.history.title"),
          { key: "aboutHistoryParagraph1", label: "History — paragraph 1", type: "textarea" },
          { key: "aboutHistoryParagraph2", label: "History — paragraph 2", type: "textarea" },
          c("about.mission.label"),
          { key: "aboutMission", label: "Mission statement", type: "textarea" },
          c("about.vision.label"),
          { key: "aboutVision", label: "Vision statement", type: "textarea" },
        ],
      },
      {
        id: "about-values",
        title: "Core values",
        description: "Up to four values. A value with no title is hidden.",
        fields: [
          c("about.values.eyebrow"),
          c("about.values.title"),
          ...[1, 2, 3, 4].flatMap((n) => [
            { key: `coreValue${n}Title`, label: `Value ${n} — title`, type: "text" as const },
            { key: `coreValue${n}Description`, label: `Value ${n} — description`, type: "textarea" as const },
          ]),
        ],
      },
      {
        id: "about-crest",
        title: "Our crest",
        fields: [c("about.crest.eyebrow"), c("about.crest.title"), c("about.crest.body")],
      },
      {
        id: "about-principal",
        title: "Principal's message",
        fields: [
          c("about.principal.eyebrow"),
          { key: "principalName", label: "Principal's name", type: "text" },
          { key: "principalTitle", label: "Title", type: "text" },
          { key: "principalQuote", label: "Message", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "academics",
    title: "Academics",
    section: "pages",
    description: "Subjects, teaching approach and the Academics page header.",
    preview: { label: "View Academics page", href: "/academics" },
    groups: [
      {
        id: "academics-header",
        title: "Header",
        fields: [
          c("academics.eyebrow"),
          c("academics.headline"),
          c("academics.headlineAccent"),
          c("academics.intro"),
          img("academicsHeroImage", "Header photograph"),
        ],
      },
      {
        id: "academics-subjects",
        title: "Subjects",
        fields: [c("academics.subjects.eyebrow"), c("academics.subjects.title"), c("academics.subjects.intro"), c("academics.areas")],
      },
      {
        id: "academics-approach",
        title: "How we teach",
        fields: [
          c("academics.approach.eyebrow"),
          c("academics.approach.title"),
          c("academics.points"),
          img("academicsApproachImage", "Section photograph"),
        ],
      },
    ],
  },
  {
    slug: "stem",
    title: "STEM",
    section: "pages",
    description: "STEM page header, approach, gallery and photos.",
    preview: { label: "View STEM page", href: "/stem-center" },
    groups: [
      {
        id: "stem-header",
        title: "Header",
        fields: [
          c("stem.eyebrow"),
          c("stem.headline"),
          c("stem.headlineAccent"),
          c("stem.intro"),
          img("stemPageImage", "Header photograph"),
          img("stemHeroImage", "Science photograph (inset on the home page STEM section)"),
        ],
      },
      {
        id: "stem-sections",
        title: "Programs & approach",
        description: "Programs themselves are managed under Content → Programs.",
        fields: [
          c("stem.programs.eyebrow"),
          c("stem.programs.title"),
          c("stem.programs.intro"),
          c("stem.approach.eyebrow"),
          c("stem.approach.title"),
          c("stem.approach.steps"),
        ],
      },
      {
        id: "stem-gallery",
        title: "Gallery",
        description: "Up to six photos. Empty slots are hidden.",
        fields: [
          c("stem.gallery.eyebrow"),
          c("stem.gallery.title"),
          ...[1, 2, 3, 4, 5, 6].map((n) => img(`stemGalleryImage${n}`, `Gallery photo ${n}`, "")),
        ],
      },
    ],
  },
  {
    slug: "community",
    title: "Community",
    section: "pages",
    description: "Community page header, themes, clubs section and photos.",
    preview: { label: "View Community page", href: "/community" },
    groups: [
      {
        id: "community-header",
        title: "Header",
        fields: [c("community.eyebrow"), c("community.headline"), c("community.intro"), img("hobbiesHeroImage", "Header photograph")],
      },
      {
        id: "community-themes",
        title: "Themes & clubs",
        description: "Clubs themselves are managed under Content → Programs (section “Community”).",
        fields: [c("community.themes"), c("community.clubs.eyebrow"), c("community.clubs.title"), c("community.clubs.intro")],
      },
      {
        id: "community-photos",
        title: "Photographs",
        fields: [img("communityImage1", "Large photograph"), img("communityImage2", "Small photograph")],
      },
    ],
  },
  {
    slug: "news",
    title: "News page",
    section: "pages",
    description: "The header of the News page. Articles are managed under Content → News.",
    preview: { label: "View News page", href: "/news" },
    groups: [{ id: "news-header", title: "Header", fields: [c("news.eyebrow"), c("news.headline"), c("news.intro")] }],
  },
  {
    slug: "contact",
    title: "Contact page",
    section: "pages",
    description: "Contact page text. The phone, email and address are in Site settings.",
    preview: { label: "View Contact page", href: "/contact-us" },
    groups: [
      { id: "contact-header", title: "Header", fields: [c("contact.eyebrow"), c("contact.headline"), c("contact.intro"), c("contact.formTitle")] },
    ],
  },
  {
    slug: "results",
    title: "Exam Results page",
    section: "pages",
    description: "Text around the exam result search. Results themselves are under Content → Exam Results.",
    preview: { label: "View Exam Results page", href: "/entrance-exam-result" },
    groups: [
      {
        id: "exam-copy",
        title: "Page text",
        fields: [c("exam.eyebrow"), c("exam.headline"), c("exam.intro"), c("exam.hint"), c("exam.help"), c("exam.helpLink")],
      },
    ],
  },
  {
    slug: "apply",
    title: "Apply page",
    section: "pages",
    description: "Open or close applications and set the message students see.",
    preview: { label: "View Apply page", href: "/apply" },
    groups: [
      {
        id: "apply-status",
        title: "Applications",
        fields: [
          c("apply.isOpen"),
          c("apply.open.title"),
          c("apply.open.body"),
          c("apply.open.button"),
          c("apply.open.url"),
          c("apply.closed.title"),
          c("apply.closed.body"),
          c("apply.backButton"),
        ],
      },
    ],
  },

  /* ------------------------------------------------ Navigation & footer */
  {
    slug: "navigation",
    title: "Navigation & footer",
    section: "navigation",
    description: "Menu labels, footer text and the “page not found” message. Link destinations are fixed.",
    groups: [
      {
        id: "nav-labels",
        title: "Menu labels",
        fields: [
          c("nav.home"),
          c("nav.about"),
          c("nav.academics"),
          c("nav.stem"),
          c("nav.community"),
          c("nav.news"),
          c("nav.contact"),
          c("nav.examResults"),
          c("nav.portal"),
        ],
      },
      {
        id: "footer-text",
        title: "Footer",
        fields: [c("brand.locationLine"), c("footer.exploreHeading"), c("footer.contactHeading"), c("footer.mottoLabel"), c("footer.bottomLine")],
      },
      {
        id: "not-found",
        title: "“Page not found” message",
        fields: [c("notFound.eyebrow"), c("notFound.title"), c("notFound.body")],
      },
    ],
  },

  /* ------------------------------------------------------------- SEO */
  {
    slug: "seo",
    title: "SEO",
    section: "seo",
    description: "How the site appears in search results and in shared links.",
    groups: [
      {
        id: "seo-site",
        title: "Whole site",
        fields: [c("seo.siteTitle"), c("seo.siteDescription"), img("seoShareImage", "Share image (link previews)", "Leave empty to use the default photo.")],
      },
      {
        id: "seo-pages",
        title: "Pages",
        description: "Each title is followed by the school name in the browser tab.",
        fields: [
          c("seo.about.title"),
          c("seo.about.description"),
          c("seo.academics.title"),
          c("seo.academics.description"),
          c("seo.stem.title"),
          c("seo.stem.description"),
          c("seo.community.title"),
          c("seo.community.description"),
          c("seo.news.title"),
          c("seo.news.description"),
          c("seo.contact.title"),
          c("seo.contact.description"),
          c("seo.exam.title"),
          c("seo.exam.description"),
        ],
      },
    ],
  },

  /* --------------------------------------------------------- Settings */
  {
    slug: "settings",
    title: "Site settings",
    section: "settings",
    description: "School name, crest, contact details and social links used across the whole site.",
    groups: [
      {
        id: "branding",
        title: "Branding",
        fields: [
          { key: "schoolName", label: "School name", type: "text", placeholder: "Alene High School" },
          { key: "schoolShortName", label: "Short name", type: "text", placeholder: "Alene HS" },
          { key: "schoolMotto", label: "Motto", type: "text", placeholder: "Excellence in science through collective effort" },
          img("logoUrl", "Crest / logo", "Leave empty to use the official crest."),
        ],
      },
      {
        id: "contact",
        title: "Contact information",
        description: "Shown in the footer and on the Contact page. Empty fields are hidden.",
        fields: [
          { key: "contactAddress", label: "Address", type: "text" },
          { key: "contactPhone", label: "Phone", type: "text" },
          { key: "contactEmail", label: "Email", type: "text" },
          { key: "contactHours", label: "Office hours", type: "text" },
        ],
      },
      {
        id: "social",
        title: "Social links",
        description: "Only filled-in links are shown in the footer.",
        fields: [
          { key: "facebookUrl", label: "Facebook URL", type: "url" },
          { key: "instagramUrl", label: "Instagram URL", type: "url" },
          { key: "youtubeUrl", label: "YouTube URL", type: "url" },
        ],
      },
    ],
  },
];

export function getSiteContentPage(slug: string) {
  return SITE_CONTENT_PAGES.find((p) => p.slug === slug);
}

export const PAGE_SECTION_SLUGS = SITE_CONTENT_PAGES.filter((p) => p.section === "pages").map((p) => p.slug);
