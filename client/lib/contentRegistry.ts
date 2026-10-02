/**
 * Registry of every piece of editable website copy.
 *
 * Each entry's `default` is the text the site shows until an admin changes it
 * in Admin → Site. Values are stored through the existing settings API under
 * the same key (lists are stored as JSON), so adding a field here needs no
 * database change. Keep defaults truthful — they ship to the live site.
 */

export type ListItemKind = "text" | "textarea" | "lines" | "program";

export interface ListItemField {
  key: string;
  label: string;
  kind: ListItemKind;
  hint?: string;
}

export type ListItem = Record<string, string>;

export type ContentField =
  | { kind: "text" | "textarea" | "url"; label: string; default: string; hint?: string }
  | { kind: "toggle"; label: string; default: boolean; hint?: string }
  | {
      kind: "list";
      label: string;
      itemLabel: string;
      item: ListItemField[];
      default: ListItem[];
      min?: number;
      max?: number;
      hint?: string;
    };

const titleBody = (bodyLabel = "Text"): ListItemField[] => [
  { key: "title", label: "Title", kind: "text" },
  { key: "body", label: bodyLabel, kind: "textarea" },
];

export const CONTENT = {
  /* ------------------------------------------------------------- Home */
  "home.hero.eyebrow": { kind: "text", label: "Small label above the headline", default: "Alene High School" },
  "home.hero.headline": { kind: "text", label: "Headline (first line, uppercase)", default: "Excellence in science" },
  "home.hero.headlineAccent": { kind: "text", label: "Headline (second line, blue)", default: "through collective effort." },
  "home.hero.body": {
    kind: "textarea",
    label: "Introduction",
    default:
      "Alene High School is a public school in Semen Sub-City, Mekelle, building a culture of scientific curiosity, academic achievement, community and service.",
  },
  "home.hero.primaryCta": { kind: "text", label: "Main button", default: "Explore Alene" },
  "home.hero.secondaryCta": { kind: "text", label: "Second button", default: "Student Achievements" },
  "home.hero.resultsLink": { kind: "text", label: "Exam results link", default: "Check exam results" },
  "home.hero.facts": {
    kind: "list",
    label: "Facts under the buttons",
    itemLabel: "Fact",
    item: [{ key: "text", label: "Fact", kind: "text" }],
    default: [{ text: "Public high school" }, { text: "Semen Sub-City, Mekelle" }, { text: "Science & STEM focus" }],
    max: 4,
  },
  "home.hero.caption": { kind: "text", label: "Photo caption", default: "Laboratory practical at Alene" },

  "home.motto.eyebrow": { kind: "text", label: "Section label", default: "What we believe" },
  "home.motto.line1": { kind: "text", label: "Large line (uppercase)", default: "Excellence in science" },
  "home.motto.line2": { kind: "text", label: "Second line (blue)", default: "through collective effort." },
  "home.motto.body": {
    kind: "textarea",
    label: "Explanation",
    default:
      "Our motto names two things at once: a standard we hold ourselves to, and the way we reach it. Excellence in science is not the work of a few gifted students — it is built together, by students, teachers and families.",
  },
  "home.pillars": {
    kind: "list",
    label: "Pillars",
    itemLabel: "Pillar",
    item: titleBody(),
    default: [
      { title: "Science", body: "Learning through curiosity, experimentation and discovery — in the lab, the workshop and the classroom." },
      { title: "Community", body: "Students, teachers, families and the wider community growing together, each carrying part of the effort." },
      { title: "Achievement", body: "Celebrating students who turn knowledge and hard work into meaningful results." },
    ],
    min: 1,
    max: 4,
  },

  "home.academics.eyebrow": { kind: "text", label: "Section label", default: "How we learn" },
  "home.academics.title": { kind: "text", label: "Heading", default: "Learning with purpose." },
  "home.academics.intro": {
    kind: "textarea",
    label: "Introduction",
    default:
      "Alene follows the national curriculum with a deliberate lean towards the sciences. Students are expected to understand ideas, not just remember them — and to show that understanding in the lab, in class and in their examinations.",
  },
  "home.academics.button": { kind: "text", label: "Button", default: "Academics at Alene" },

  "home.stem.eyebrow": { kind: "text", label: "Section label", default: "STEM at Alene" },
  "home.stem.headline": { kind: "text", label: "Headline (first line)", default: "We don’t just teach science." },
  "home.stem.headlineAccent": { kind: "text", label: "Headline (second line)", default: "We give students room to explore it." },
  "home.stem.body": {
    kind: "textarea",
    label: "Introduction",
    default: "From robotics builds to laboratory practicals, Alene students learn by designing, testing and presenting their own work.",
  },
  "home.stem.button": { kind: "text", label: "Button", default: "Explore STEM at Alene" },
  "home.stem.items": {
    kind: "list",
    label: "STEM highlights",
    itemLabel: "Highlight",
    item: [
      { key: "title", label: "Title", kind: "text" },
      { key: "body", label: "Text", kind: "textarea" },
      { key: "href", label: "Link", kind: "text", hint: "A page on this site, e.g. /stem-center/robotics-automation" },
    ],
    default: [
      { title: "Robotics", body: "Students design, build and program machines — and take them to competitions.", href: "/stem-center/robotics-automation" },
      { title: "Science", body: "Practical laboratory learning in physics, chemistry and biology, beyond the textbook.", href: "/stem-center/science-lab" },
      { title: "Technology", body: "Coding and digital skills that prepare students for what comes next.", href: "/stem-center/web-development" },
    ],
    min: 1,
    max: 4,
  },

  "home.achievements.eyebrow": { kind: "text", label: "Section label", default: "Student achievements" },
  "home.achievements.title": { kind: "text", label: "Heading", default: "What our students achieve." },
  "home.achievements.intro": {
    kind: "textarea",
    label: "Introduction",
    default: "Results earned through practice, teamwork and persistence — in competitions, in the classroom and in the community.",
  },
  "home.achievements.slots": {
    kind: "list",
    label: "Achievement wall",
    itemLabel: "Slot",
    hint: "Each slot shows the most recent achievement of the chosen program. The first slot is the large one with the photo.",
    item: [
      { key: "label", label: "Label", kind: "text" },
      { key: "programSlug", label: "Program", kind: "program" },
    ],
    default: [
      { label: "Robotics", programSlug: "robotics-automation" },
      { label: "Science", programSlug: "science-lab" },
      { label: "Community", programSlug: "community-service" },
    ],
    min: 1,
    max: 3,
  },

  "home.community.eyebrow": { kind: "text", label: "Section label", default: "Beyond the classroom" },
  "home.community.headline": { kind: "text", label: "Heading", default: "Education doesn’t end at the school gate." },
  "home.community.body": {
    kind: "textarea",
    label: "Introduction",
    default:
      "Alene students give time to their campus and their neighbourhood — cleaning, planting, painting and helping out where they are needed. It is where collective effort stops being a motto and becomes a habit.",
  },
  "home.community.themes": {
    kind: "list",
    label: "Themes",
    itemLabel: "Theme",
    item: titleBody(),
    default: [
      { title: "School community", body: "Assemblies, clubs and shared responsibility for campus life." },
      { title: "Community service", body: "Students volunteering on projects that improve the places around them." },
      { title: "Student participation", body: "Councils, sports and the arts — every student has a way to take part." },
    ],
    min: 1,
    max: 5,
  },
  "home.community.button": { kind: "text", label: "Button", default: "Clubs & community life" },
  "home.community.caption": { kind: "text", label: "Photo caption", default: "Community service, Alene students" },

  "home.news.eyebrow": { kind: "text", label: "Section label", default: "Stay connected" },
  "home.news.title": { kind: "text", label: "Heading", default: "Latest from Alene." },
  "home.news.link": { kind: "text", label: "Link to all news", default: "All news" },

  /* ------------------------------------------- Exam results call-to-action */
  "cta.results.eyebrow": { kind: "text", label: "Label", default: "Academic results" },
  "cta.results.title": { kind: "text", label: "Heading", default: "See examination results and academic updates." },
  "cta.results.body": { kind: "text", label: "Text", default: "Students can look up their entrance exam result with their registration ID." },
  "cta.results.button": { kind: "text", label: "Button", default: "Check exam results" },

  /* ------------------------------------------------------------ About */
  "about.eyebrow": { kind: "text", label: "Small label", default: "About Alene" },
  "about.headline": { kind: "text", label: "Headline (first line)", default: "A public school with" },
  "about.headlineAccent": { kind: "text", label: "Headline (second line, blue)", default: "a science-first spirit." },
  "about.intro": {
    kind: "textarea",
    label: "Introduction",
    hint: "{school} and {motto} are replaced with the school name and motto.",
    default: "{school} serves students in Semen Sub-City, Mekelle. Our motto — “{motto}” — shapes how we teach, learn and work together.",
  },
  "about.history.eyebrow": { kind: "text", label: "History — label", default: "Our history" },
  "about.history.title": { kind: "text", label: "History — heading", default: "Where we come from." },
  "about.mission.label": { kind: "text", label: "Mission label", default: "Mission" },
  "about.vision.label": { kind: "text", label: "Vision label", default: "Vision" },
  "about.values.eyebrow": { kind: "text", label: "Values — label", default: "Core values" },
  "about.values.title": { kind: "text", label: "Values — heading", default: "The principles behind the work." },
  "about.crest.eyebrow": { kind: "text", label: "Crest — label", default: "Our crest" },
  "about.crest.title": { kind: "text", label: "Crest — heading", default: "Semen Sub-City Alene High School." },
  "about.crest.body": {
    kind: "textarea",
    label: "Crest — text",
    default:
      "The school crest carries our name in Ge'ez script and in English, together with the Mekelle Administration Office. At its centre sit a balanced pair of scales and an upward arrow, framed by a gear — the same circular geometry you will see echoed across this site.",
  },
  "about.principal.eyebrow": { kind: "text", label: "Principal — label", default: "Principal's message" },

  /* -------------------------------------------------------- Academics */
  "academics.eyebrow": { kind: "text", label: "Small label", default: "Academics" },
  "academics.headline": { kind: "text", label: "Headline (first line)", default: "Learning with purpose." },
  "academics.headlineAccent": { kind: "text", label: "Headline (second line, blue)", default: "Science at the centre." },
  "academics.intro": {
    kind: "textarea",
    label: "Introduction",
    default: "Alene follows the national curriculum, with a deliberate lean towards the sciences and a habit of learning by doing.",
  },
  "academics.subjects.eyebrow": { kind: "text", label: "Subjects — label", default: "Subjects" },
  "academics.subjects.title": { kind: "text", label: "Subjects — heading", default: "What students study." },
  "academics.subjects.intro": {
    kind: "textarea",
    label: "Subjects — introduction",
    default: "Subjects are grouped into four areas. Every student builds a strong foundation in mathematics and the natural sciences.",
  },
  "academics.areas": {
    kind: "list",
    label: "Subject areas (also shown on the home page)",
    itemLabel: "Subject area",
    item: [
      { key: "title", label: "Area", kind: "text" },
      { key: "subjects", label: "Subjects", kind: "lines", hint: "One subject per line." },
    ],
    default: [
      { title: "Natural Sciences", subjects: "Mathematics\nPhysics\nChemistry\nBiology" },
      { title: "Languages", subjects: "English\nTigrinya\nAmharic" },
      { title: "Social Sciences", subjects: "Geography\nHistory\nCivics & Ethical Education" },
      { title: "Technology & Skills", subjects: "Information Technology\nPhysical Education" },
    ],
    min: 1,
    max: 8,
  },
  "academics.approach.eyebrow": { kind: "text", label: "Approach — label", default: "How we teach" },
  "academics.approach.title": { kind: "text", label: "Approach — heading", default: "Understanding over memorising." },
  "academics.points": {
    kind: "list",
    label: "Teaching points (also shown on the home page)",
    itemLabel: "Point",
    item: titleBody(),
    default: [
      { title: "Practical learning", body: "Laboratory work and hands-on practicals sit alongside classroom teaching, so students see the ideas they study at work." },
      { title: "Exam preparation", body: "Students are supported through national examinations with revision, practice and guidance from their teachers." },
      { title: "Clear results", body: "Entrance exam results are published online, so students and families can check them with a registration ID." },
    ],
    min: 1,
    max: 6,
  },

  /* ------------------------------------------------------------- STEM */
  "stem.eyebrow": { kind: "text", label: "Small label", default: "STEM at Alene" },
  "stem.headline": { kind: "text", label: "Headline (first line)", default: "We don’t just teach science." },
  "stem.headlineAccent": { kind: "text", label: "Headline (second line, blue)", default: "We give students room to explore it." },
  "stem.intro": {
    kind: "textarea",
    label: "Introduction",
    default: "From robotics builds to laboratory practicals, Alene students learn by designing, testing and presenting their own work.",
  },
  "stem.programs.eyebrow": { kind: "text", label: "Programs — label", default: "Programs" },
  "stem.programs.title": { kind: "text", label: "Programs — heading", default: "Where students explore." },
  "stem.programs.intro": { kind: "text", label: "Programs — introduction", default: "Choose a program to see what students do and what they have achieved." },
  "stem.approach.eyebrow": { kind: "text", label: "Approach — label", default: "How STEM works here" },
  "stem.approach.title": { kind: "text", label: "Approach — heading", default: "Curiosity, then evidence." },
  "stem.approach.steps": {
    kind: "list",
    label: "Approach steps",
    itemLabel: "Step",
    item: titleBody(),
    default: [
      { title: "Research projects", body: "Guided projects that build careful, critical scientific thinking." },
      { title: "Build and test", body: "Students design something, try it, see where it fails and improve it." },
      { title: "Present the work", body: "Projects are explained to judges, teachers and peers — at school and at competitions." },
    ],
    min: 1,
    max: 6,
  },
  "stem.gallery.eyebrow": { kind: "text", label: "Gallery — label", default: "Gallery" },
  "stem.gallery.title": { kind: "text", label: "Gallery — heading", default: "In the lab and the workshop." },

  /* -------------------------------------------------------- Community */
  "community.eyebrow": { kind: "text", label: "Small label", default: "Beyond the classroom" },
  "community.headline": { kind: "text", label: "Headline", default: "Education doesn’t end at the school gate." },
  "community.intro": {
    kind: "textarea",
    label: "Introduction",
    default:
      "Alene students give time to their campus and their neighbourhood — cleaning, planting, painting and helping out where they are needed. It is where collective effort stops being a motto and becomes a habit.",
  },
  "community.themes": {
    kind: "list",
    label: "Themes",
    itemLabel: "Theme",
    item: titleBody(),
    default: [
      { title: "School community", body: "Assemblies, clubs and shared responsibility for campus life." },
      { title: "Community service", body: "Students volunteering on projects that improve the places around them." },
      { title: "Student participation", body: "Councils, sports and the arts — every student has a way to take part." },
    ],
    min: 1,
    max: 6,
  },
  "community.clubs.eyebrow": { kind: "text", label: "Clubs — label", default: "Clubs & programs" },
  "community.clubs.title": { kind: "text", label: "Clubs — heading", default: "Ways to take part." },
  "community.clubs.intro": {
    kind: "textarea",
    label: "Clubs — introduction",
    default: "Every student can find a place beyond lessons — on the pitch, on stage, in council or out in the community.",
  },

  /* ------------------------------------------------------- News page */
  "news.eyebrow": { kind: "text", label: "Small label", default: "News & updates" },
  "news.headline": { kind: "text", label: "Headline", default: "Latest from Alene." },
  "news.intro": { kind: "text", label: "Introduction", default: "Announcements, achievements and stories from around the school." },

  /* ---------------------------------------------------- Contact page */
  "contact.eyebrow": { kind: "text", label: "Small label", default: "Contact" },
  "contact.headline": { kind: "text", label: "Headline", default: "Get in touch." },
  "contact.intro": {
    kind: "textarea",
    label: "Introduction",
    default: "Questions about admissions, academics or school life? Send us a message or reach the registrar directly.",
  },
  "contact.formTitle": { kind: "text", label: "Form heading", default: "Send a message" },

  /* ----------------------------------------------- Exam results page */
  "exam.eyebrow": { kind: "text", label: "Small label", default: "Academic results" },
  "exam.headline": { kind: "text", label: "Headline", default: "Check your entrance exam result." },
  "exam.intro": {
    kind: "textarea",
    label: "Instructions",
    default: "Enter the registration ID printed on your exam slip to see your score and status.",
  },
  "exam.hint": {
    kind: "text",
    label: "Hint under the search box",
    default: "Sample IDs: AHS-2026-0001, AHS-2026-0002, AHS-2026-0003, AHS-2026-0004",
  },
  "exam.help": {
    kind: "text",
    label: "Help text",
    default: "Can't find your result? Check that the ID matches your exam slip exactly, or",
  },
  "exam.helpLink": { kind: "text", label: "Help link (goes to the Contact page)", default: "contact the registrar" },

  /* ------------------------------------------------------ Apply page */
  "apply.isOpen": {
    kind: "toggle",
    label: "Applications are open",
    default: false,
    hint: "When on, the Apply page shows the “open” text and a button to the application link.",
  },
  "apply.closed.title": { kind: "text", label: "Closed — heading", default: "Applications Are Currently Closed" },
  "apply.closed.body": {
    kind: "textarea",
    label: "Closed — message",
    default: "Applications are currently closed. Please check our website for future updates.",
  },
  "apply.open.title": { kind: "text", label: "Open — heading", default: "Applications Are Open" },
  "apply.open.body": {
    kind: "textarea",
    label: "Open — message",
    default: "Applications for the new academic year are open. Use the button below to apply.",
  },
  "apply.open.button": { kind: "text", label: "Open — button", default: "Apply now" },
  "apply.open.url": {
    kind: "url",
    label: "Open — application link",
    default: "",
    hint: "Where the button goes, e.g. an online form. The button is hidden while this is empty.",
  },
  "apply.backButton": { kind: "text", label: "Back button", default: "Back to Home" },

  /* -------------------------------------------- Navigation & footer */
  "nav.home": { kind: "text", label: "Home", default: "Home" },
  "nav.about": { kind: "text", label: "About", default: "About" },
  "nav.academics": { kind: "text", label: "Academics", default: "Academics" },
  "nav.stem": { kind: "text", label: "STEM", default: "STEM" },
  "nav.community": { kind: "text", label: "Community", default: "Community" },
  "nav.news": { kind: "text", label: "News", default: "News" },
  "nav.contact": { kind: "text", label: "Contact (footer and mobile menu)", default: "Contact" },
  "nav.examResults": { kind: "text", label: "Exam results button", default: "Exam Results" },
  "nav.portal": { kind: "text", label: "Portal login", default: "Portal" },
  "brand.locationLine": { kind: "text", label: "Line under the logo (footer)", default: "Semen Sub-City · Mekelle" },
  "footer.exploreHeading": { kind: "text", label: "Links heading", default: "Explore" },
  "footer.contactHeading": { kind: "text", label: "Contact heading", default: "Visit & contact" },
  "footer.mottoLabel": { kind: "text", label: "Label under the motto", default: "School motto" },
  "footer.bottomLine": { kind: "text", label: "Bottom-right line", default: "Mekelle Administration Office · Semen Sub-City" },
  "notFound.eyebrow": { kind: "text", label: "Page not found — label", default: "Page not found" },
  "notFound.title": { kind: "text", label: "Page not found — heading", default: "We couldn't find that page." },
  "notFound.body": { kind: "text", label: "Page not found — text", default: "It may have moved, or the link may be out of date." },

  /* -------------------------------------------------------------- SEO */
  "seo.siteTitle": { kind: "text", label: "Site title (home page and browser tab)", default: "Alene High School | Semen Sub-City, Mekelle" },
  "seo.siteDescription": {
    kind: "textarea",
    label: "Site description (search results and link previews)",
    default:
      "Alene High School is a public high school in Semen Sub-City, Mekelle, Ethiopia — building a culture of science, STEM learning, academic excellence and community service.",
  },
  "seo.about.title": { kind: "text", label: "About — title", default: "About" },
  "seo.about.description": {
    kind: "textarea",
    label: "About — description",
    default: "The story, mission and values of Alene High School, a public high school in Semen Sub-City, Mekelle.",
  },
  "seo.academics.title": { kind: "text", label: "Academics — title", default: "Academics" },
  "seo.academics.description": {
    kind: "textarea",
    label: "Academics — description",
    default:
      "Academics at Alene High School, Mekelle: the national curriculum with a strong emphasis on science, practical laboratory learning and examination support.",
  },
  "seo.stem.title": { kind: "text", label: "STEM — title", default: "STEM" },
  "seo.stem.description": {
    kind: "textarea",
    label: "STEM — description",
    default:
      "STEM at Alene High School, Mekelle: robotics, practical laboratory science and technology, learned by building, testing and presenting.",
  },
  "seo.community.title": { kind: "text", label: "Community — title", default: "Community" },
  "seo.community.description": {
    kind: "textarea",
    label: "Community — description",
    default: "Community life at Alene High School, Mekelle: community service, clubs, sports, the arts and student leadership.",
  },
  "seo.news.title": { kind: "text", label: "News — title", default: "News" },
  "seo.news.description": {
    kind: "textarea",
    label: "News — description",
    default: "News, achievements and announcements from Alene High School, Mekelle.",
  },
  "seo.contact.title": { kind: "text", label: "Contact — title", default: "Contact" },
  "seo.contact.description": {
    kind: "textarea",
    label: "Contact — description",
    default: "Contact Alene High School in Semen Sub-City, Mekelle, Ethiopia.",
  },
  "seo.exam.title": { kind: "text", label: "Exam results — title", default: "Exam Results" },
  "seo.exam.description": {
    kind: "textarea",
    label: "Exam results — description",
    default: "Check Alene High School entrance exam results online with your registration ID.",
  },
} satisfies Record<string, ContentField>;

export type ContentKey = keyof typeof CONTENT;
type FieldOfKind<K extends ContentField["kind"]> = {
  [P in ContentKey]: (typeof CONTENT)[P]["kind"] extends K ? P : never;
}[ContentKey];
export type TextKey = FieldOfKind<"text" | "textarea" | "url">;
export type ListKey = FieldOfKind<"list">;
export type ToggleKey = FieldOfKind<"toggle">;

/** The stored-string form of a field's default (lists → JSON, toggles → "true"/"false"). */
export function serializeDefault(field: ContentField): string {
  if (field.kind === "list") return JSON.stringify(field.default);
  if (field.kind === "toggle") return String(field.default);
  return field.default;
}

/** Parses a stored list value; returns null if it isn't a usable list. */
export function parseList(raw: string | undefined, field: Extract<ContentField, { kind: "list" }>): ListItem[] | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return null;
    const keys = field.item.map((f) => f.key);
    const items = value
      .filter((v) => v && typeof v === "object")
      .map((v) => Object.fromEntries(keys.map((k) => [k, typeof v[k] === "string" ? v[k] : ""])))
      .filter((item) => keys.some((k) => item[k].trim()));
    return items.length ? items : null;
  } catch {
    return null;
  }
}
