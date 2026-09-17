import { API_BASE_URL } from "./constants";
import type { Program, ProgramAchievement, ProgramCategory } from "./types";

export const PROGRAMS: Program[] = [
  {
    slug: "web-development",
    category: "stem-center",
    title: "Web Development",
    summary:
      "Modern web engineering — full-stack frameworks and dynamic applications built by students.",
    description:
      "The Web Development track teaches students to design, build, and ship real full-stack applications. Students learn HTML/CSS/JavaScript fundamentals before advancing into modern frameworks, REST APIs, and database-backed projects — culminating in a capstone app each student can showcase in a portfolio.",
    imageSrc:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&q=80",
    curriculumHighlights: [
      "HTML, CSS & modern JavaScript fundamentals",
      "Full-stack frameworks (React, Node.js, REST APIs)",
      "Database design with SQL and ORMs",
      "Capstone: a deployed, portfolio-ready web application",
    ],
    establishedYear: 2021,
  },
  {
    slug: "robotics-automation",
    category: "stem-center",
    title: "Robotics & Automation",
    summary:
      "Mechatronics, Arduino/Raspberry Pi programming, and autonomous mechanical systems.",
    description:
      "Students in Robotics & Automation design and build physical machines that sense and act on the world — combining mechanical design, electronics, and embedded programming with Arduino and Raspberry Pi platforms. The program culminates in regional robotics competitions each year.",
    imageSrc:
      "https://images.unsplash.com/photo-1581091870621-1e9b6b3f5c8b?auto=format&fit=crop&w=1000&q=80",
    curriculumHighlights: [
      "Mechatronics and circuit design fundamentals",
      "Arduino & Raspberry Pi embedded programming",
      "Autonomous navigation and sensor integration",
      "Team-based builds for regional robotics competitions",
    ],
    establishedYear: 2019,
  },
  {
    slug: "biotechnology-applied-sciences",
    category: "stem-center",
    title: "Biotechnology & Applied Sciences",
    summary:
      "Laboratory experiments, genetics fundamentals, and environmental research.",
    description:
      "This program gives students hands-on laboratory experience across genetics, microbiology, and environmental science. Students design and run original research projects, many of which are presented at regional science fairs and community environmental initiatives.",
    imageSrc:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80",
    curriculumHighlights: [
      "Laboratory safety and experimental design",
      "Genetics and molecular biology fundamentals",
      "Environmental sampling and applied research",
      "Independent research projects presented at science fairs",
    ],
    establishedYear: 2020,
  },
  {
    slug: "arts-music",
    category: "hobbies",
    title: "Arts & Music",
    summary: "Painting, sketching, digital design, choir, and instrumental ensembles.",
    description:
      "Arts & Music brings together every visual and performing arts initiative at Alene High School — from painting and digital design workshops to choir and instrumental ensembles. Students showcase their work at termly exhibitions and school-wide performances.",
    imageSrc:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1000&q=80",
    curriculumHighlights: [
      "Painting, sketching & digital design workshops",
      "Choir and instrumental ensemble training",
      "Termly student art exhibitions",
      "School-wide performance showcases",
    ],
    establishedYear: 2017,
  },
  {
    slug: "sports-athletics",
    category: "hobbies",
    title: "Sports & Athletics",
    summary: "Team sports, track & field, and school-wide fitness programs.",
    description:
      "Sports & Athletics unites all of the school's team sports, track and field, and fitness activities under one program. Students train year-round and compete in inter-school tournaments, with an emphasis on teamwork, discipline, and healthy competition.",
    imageSrc:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80",
    curriculumHighlights: [
      "Football, basketball & team sports training",
      "Track and field conditioning",
      "Inter-school tournament competition",
      "School-wide fitness and wellness programs",
    ],
    establishedYear: 2015,
  },
  {
    slug: "leadership-student-council",
    category: "hobbies",
    title: "Leadership & Student Body Council",
    summary: "Student governance, public speaking, and policy advocacy.",
    description:
      "The Leadership & Student Body Council program trains students in governance, public speaking, and policy advocacy. Elected representatives run school-wide initiatives, mediate student concerns, and represent the student body in decisions that shape school life.",
    imageSrc:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
    curriculumHighlights: [
      "Student council elections & governance structure",
      "Public speaking and debate training",
      "School policy advocacy projects",
      "Leadership mentorship from faculty advisors",
    ],
    establishedYear: 2016,
  },
  {
    slug: "community-service",
    category: "hobbies",
    title: "Community Service",
    summary: "Student outreach, local volunteer initiatives, and social impact projects.",
    description:
      "Community Service connects students with local outreach and volunteer initiatives — from neighborhood clean-up drives to partnerships with local shelters and clinics. The program builds civic responsibility and measurable social impact each academic year.",
    imageSrc:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80",
    curriculumHighlights: [
      "Neighborhood outreach & volunteer initiatives",
      "Partnerships with local shelters and clinics",
      "Termly community impact projects",
      "Civic responsibility and reflection workshops",
    ],
    establishedYear: 2018,
  },
];

export const MOCK_ACHIEVEMENTS: ProgramAchievement[] = [
  {
    id: "wd-1",
    programSlug: "web-development",
    category: "stem-center",
    title: "Student-Built Alumni Portal Launched Sitewide",
    description:
      "Three seniors designed and shipped a full-stack alumni directory now used by the school's alumni office.",
    year: 2025,
    metricLabel: "Active users",
    metricValue: "600+",
  },
  {
    id: "wd-2",
    programSlug: "web-development",
    category: "stem-center",
    title: "Regional Coding Challenge — 1st Place",
    description:
      "Web Development track students placed first in the regional inter-school coding challenge.",
    year: 2024,
  },
  {
    id: "ra-1",
    programSlug: "robotics-automation",
    category: "stem-center",
    title: "Regional Robotics Championship — 1st Place",
    description:
      "Our autonomous rover took first place at the regional robotics competition against 18 schools.",
    year: 2026,
    metricLabel: "Schools competed against",
    metricValue: "18",
  },
  {
    id: "ra-2",
    programSlug: "robotics-automation",
    category: "stem-center",
    title: "National Robotics Invitational — Semifinalist",
    description:
      "Advanced to the national semifinal round for the first time in program history.",
    year: 2024,
  },
  {
    id: "ba-1",
    programSlug: "biotechnology-applied-sciences",
    category: "stem-center",
    title: "Regional Science Fair — Best Research Award",
    description:
      "A student-led water quality study earned Best Research at the regional science fair.",
    year: 2025,
    metricLabel: "Water samples analyzed",
    metricValue: "120+",
  },
  {
    id: "ba-2",
    programSlug: "biotechnology-applied-sciences",
    category: "stem-center",
    title: "Community Environmental Impact Study",
    description:
      "Students partnered with the local municipality on a soil contamination survey.",
    year: 2023,
  },
  {
    id: "am-1",
    programSlug: "arts-music",
    category: "hobbies",
    title: "Regional Choir Festival — Gold Rating",
    description: "The school choir earned a gold rating at the regional choir festival.",
    year: 2025,
  },
  {
    id: "am-2",
    programSlug: "arts-music",
    category: "hobbies",
    title: "Annual Student Art Exhibition",
    description: "Over 80 student artworks displayed at the termly exhibition.",
    year: 2024,
    metricLabel: "Artworks exhibited",
    metricValue: "80+",
  },
  {
    id: "sa-1",
    programSlug: "sports-athletics",
    category: "hobbies",
    title: "Inter-School Football Tournament — Champions",
    description: "The varsity football team won the district championship.",
    year: 2025,
  },
  {
    id: "sa-2",
    programSlug: "sports-athletics",
    category: "hobbies",
    title: "Track & Field Regional Records",
    description: "Two school records broken at the regional track & field meet.",
    year: 2024,
    metricLabel: "Records broken",
    metricValue: "2",
  },
  {
    id: "ls-1",
    programSlug: "leadership-student-council",
    category: "hobbies",
    title: "Student Policy Proposal Adopted",
    description:
      "A student council proposal for a peer-mentorship program was formally adopted by the school administration.",
    year: 2025,
  },
  {
    id: "ls-2",
    programSlug: "leadership-student-council",
    category: "hobbies",
    title: "Regional Youth Leadership Summit",
    description: "Council representatives presented at the regional youth leadership summit.",
    year: 2023,
  },
  {
    id: "cs-1",
    programSlug: "community-service",
    category: "hobbies",
    title: "Annual Clean-Up Drive Milestone",
    description: "Volunteers collected over 2 tons of waste across five neighborhoods.",
    year: 2025,
    metricLabel: "Waste collected",
    metricValue: "2+ tons",
  },
  {
    id: "cs-2",
    programSlug: "community-service",
    category: "hobbies",
    title: "Local Shelter Partnership",
    description: "Established an ongoing volunteer partnership with a local family shelter.",
    year: 2022,
  },
];

export function getProgramsByCategory(category: ProgramCategory): Program[] {
  return PROGRAMS.filter((p) => p.category === category);
}

export function getProgramBySlug(
  category: ProgramCategory,
  slug: string
): Program | undefined {
  return PROGRAMS.find((p) => p.category === category && p.slug === slug);
}

export function getMockAchievements(slug: string): ProgramAchievement[] {
  return MOCK_ACHIEVEMENTS.filter((a) => a.programSlug === slug).sort(
    (a, b) => b.year - a.year
  );
}

/**
 * Fetches live achievement records from the backend, falling back to mock
 * data when the API is unreachable or has no records for the slug yet.
 */
export async function fetchAchievements(slug: string): Promise<ProgramAchievement[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/programs/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Program achievements request failed");
    const data = await res.json();
    if (Array.isArray(data.achievements) && data.achievements.length > 0) {
      return data.achievements;
    }
    return getMockAchievements(slug);
  } catch {
    return getMockAchievements(slug);
  }
}
