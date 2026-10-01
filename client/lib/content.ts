/**
 * Editorial copy for the public site, kept apart from the components so it
 * can be edited (or moved into the admin CMS later) without touching layout.
 *
 * Items marked "PLACEHOLDER" are illustrative and should be confirmed or
 * replaced by the school.
 */

export const HERO_COPY = {
  eyebrow: "Alene High School",
  headline: "Excellence in science",
  headlineAccent: "through collective effort.",
  body:
    "Alene High School is a public school in Semen Sub-City, Mekelle, building a culture of scientific curiosity, academic achievement, community and service.",
  facts: ["Public high school", "Semen Sub-City, Mekelle", "Science & STEM focus"],
};

export const PILLARS = [
  {
    title: "Science",
    body: "Learning through curiosity, experimentation and discovery — in the lab, the workshop and the classroom.",
  },
  {
    title: "Community",
    body: "Students, teachers, families and the wider community growing together, each carrying part of the effort.",
  },
  {
    title: "Achievement",
    body: "Celebrating students who turn knowledge and hard work into meaningful results.",
  },
];

// PLACEHOLDER — confirm subject groupings with the academic office.
export const ACADEMIC_AREAS = [
  {
    title: "Natural Sciences",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
  },
  {
    title: "Languages",
    subjects: ["English", "Tigrinya", "Amharic"],
  },
  {
    title: "Social Sciences",
    subjects: ["Geography", "History", "Civics & Ethical Education"],
  },
  {
    title: "Technology & Skills",
    subjects: ["Information Technology", "Physical Education"],
  },
];

export const ACADEMIC_POINTS = [
  {
    title: "Practical learning",
    body: "Laboratory work and hands-on practicals sit alongside classroom teaching, so students see the ideas they study at work.",
  },
  {
    title: "Exam preparation",
    body: "Students are supported through national examinations with revision, practice and guidance from their teachers.",
  },
  {
    title: "Clear results",
    body: "Entrance exam results are published online, so students and families can check them with a registration ID.",
  },
];

export const STEM_COPY = {
  eyebrow: "STEM at Alene",
  headline: "We don’t just teach science.",
  headlineAccent: "We give students room to explore it.",
  body:
    "From robotics builds to laboratory practicals, Alene students learn by designing, testing and presenting their own work.",
  items: [
    {
      title: "Robotics",
      body: "Students design, build and program machines — and take them to competitions.",
      href: "/stem-center/robotics-automation",
    },
    {
      title: "Science",
      body: "Practical laboratory learning in physics, chemistry and biology, beyond the textbook.",
      href: "/stem-center/science-lab",
    },
    {
      title: "Technology",
      body: "Coding and digital skills that prepare students for what comes next.",
      href: "/stem-center/web-development",
    },
  ],
};

/** Which program each slot on the home page achievement wall draws from. */
export const ACHIEVEMENT_SLOTS = [
  { label: "Robotics", programSlug: "robotics-automation" },
  { label: "Science", programSlug: "science-lab" },
  { label: "Community", programSlug: "community-service" },
];

export const COMMUNITY_COPY = {
  eyebrow: "Beyond the classroom",
  headline: "Education doesn’t end at the school gate.",
  body:
    "Alene students give time to their campus and their neighbourhood — cleaning, planting, painting and helping out where they are needed. It is where collective effort stops being a motto and becomes a habit.",
  themes: [
    { title: "School community", body: "Assemblies, clubs and shared responsibility for campus life." },
    { title: "Community service", body: "Students volunteering on projects that improve the places around them." },
    { title: "Student participation", body: "Councils, sports and the arts — every student has a way to take part." },
  ],
};
