import "dotenv/config";
import { PrismaClient, ExamStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.examResult.createMany({
    data: [
      {
        registrationId: "AHS-2026-0001",
        studentName: "Samuel Tesfaye",
        score: 92,
        total: 100,
        status: ExamStatus.PASS,
        examYear: 2026,
      },
      {
        registrationId: "AHS-2026-0002",
        studentName: "Hana Girma",
        score: 78,
        total: 100,
        status: ExamStatus.PASS,
        examYear: 2026,
      },
      {
        registrationId: "AHS-2026-0003",
        studentName: "Yonas Alemu",
        score: 41,
        total: 100,
        status: ExamStatus.FAIL,
        examYear: 2026,
      },
      {
        registrationId: "AHS-2026-0004",
        studentName: "Liya Bekele",
        score: 0,
        total: 100,
        status: ExamStatus.PENDING,
        examYear: 2026,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.newsArticle.createMany({
    data: [
      {
        title: "Alene High School Robotics Team Wins Regional Championship",
        slug: "robotics-team-wins-regional-championship",
        excerpt:
          "Our S&T Robotics Club took first place at the regional robotics competition, showcasing months of hard work and innovation.",
        content:
          "Our S&T Robotics Club took first place at the regional robotics competition, showcasing months of hard work and innovation. The team built an autonomous rover capable of navigating complex obstacle courses, impressing judges with both engineering quality and presentation.",
        category: "Achievements",
        imageUrl:
          "https://images.unsplash.com/photo-1581091870621-1e9b6b3f5c8b?auto=format&fit=crop&w=1200&q=80",
        publishedAt: new Date("2026-08-20"),
      },
      {
        title: "New STEM Center Officially Opens Its Doors",
        slug: "new-stem-center-opens",
        excerpt:
          "The newly built STEM Center features modern science labs, a robotics workshop, and a dedicated innovation hub for students.",
        content:
          "The newly built STEM Center features modern science labs, a robotics workshop, and a dedicated innovation hub for students. The facility was designed to give students hands-on exposure to physics, chemistry, biology, and computer science.",
        category: "Campus",
        imageUrl:
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
        publishedAt: new Date("2026-08-05"),
      },
      {
        title: "Entrance Exam Results for 2026 Now Available",
        slug: "entrance-exam-results-2026",
        excerpt:
          "Prospective students can now check their entrance exam results online using their registration ID.",
        content:
          "Prospective students can now check their entrance exam results online using their registration ID. Visit the Entrance Exam Result page and enter your registration ID to view your score instantly.",
        category: "Admissions",
        imageUrl:
          "https://images.unsplash.com/photo-1554774853-b415df9eeb92?auto=format&fit=crop&w=1200&q=80",
        publishedAt: new Date("2026-07-28"),
      },
      {
        title: "Annual Sports Day Brings Students Together",
        slug: "annual-sports-day",
        excerpt:
          "Students competed in track and field, football, and basketball events during our vibrant annual Sports Day.",
        content:
          "Students competed in track and field, football, and basketball events during our vibrant annual Sports Day. The event celebrated teamwork, discipline, and school spirit across all grade levels.",
        category: "Events",
        imageUrl:
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
        publishedAt: new Date("2026-06-15"),
      },
    ],
    skipDuplicates: true,
  });

  await prisma.programAchievement.createMany({
    data: [
      {
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
        programSlug: "web-development",
        category: "stem-center",
        title: "Regional Coding Challenge — 1st Place",
        description:
          "Web Development track students placed first in the regional inter-school coding challenge.",
        year: 2024,
      },
      {
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
        programSlug: "robotics-automation",
        category: "stem-center",
        title: "National Robotics Invitational — Semifinalist",
        description:
          "Advanced to the national semifinal round for the first time in program history.",
        year: 2024,
      },
      {
        programSlug: "science-lab",
        category: "stem-center",
        title: "Regional Science Fair — Best Research Award",
        description:
          "A student-led water quality study earned Best Research at the regional science fair.",
        year: 2025,
        metricLabel: "Water samples analyzed",
        metricValue: "120+",
      },
      {
        programSlug: "science-lab",
        category: "stem-center",
        title: "Community Environmental Impact Study",
        description: "Students partnered with the local municipality on a soil contamination survey.",
        year: 2023,
      },
      {
        programSlug: "arts-music",
        category: "hobbies",
        title: "Regional Choir Festival — Gold Rating",
        description: "The school choir earned a gold rating at the regional choir festival.",
        year: 2025,
      },
      {
        programSlug: "arts-music",
        category: "hobbies",
        title: "Annual Student Art Exhibition",
        description: "Over 80 student artworks displayed at the termly exhibition.",
        year: 2024,
        metricLabel: "Artworks exhibited",
        metricValue: "80+",
      },
      {
        programSlug: "sports-athletics",
        category: "hobbies",
        title: "Inter-School Football Tournament — Champions",
        description: "The varsity football team won the district championship.",
        year: 2025,
      },
      {
        programSlug: "sports-athletics",
        category: "hobbies",
        title: "Track & Field Regional Records",
        description: "Two school records broken at the regional track & field meet.",
        year: 2024,
        metricLabel: "Records broken",
        metricValue: "2",
      },
      {
        programSlug: "leadership-student-council",
        category: "hobbies",
        title: "Student Policy Proposal Adopted",
        description:
          "A student council proposal for a peer-mentorship program was formally adopted by the school administration.",
        year: 2025,
      },
      {
        programSlug: "leadership-student-council",
        category: "hobbies",
        title: "Regional Youth Leadership Summit",
        description: "Council representatives presented at the regional youth leadership summit.",
        year: 2023,
      },
      {
        programSlug: "community-service",
        category: "hobbies",
        title: "Annual Clean-Up Drive Milestone",
        description: "Volunteers collected over 2 tons of waste across five neighborhoods.",
        year: 2025,
        metricLabel: "Waste collected",
        metricValue: "2+ tons",
      },
      {
        programSlug: "community-service",
        category: "hobbies",
        title: "Local Shelter Partnership",
        description: "Established an ongoing volunteer partnership with a local family shelter.",
        year: 2022,
      },
    ],
    skipDuplicates: true,
  });

  const hashed = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "admin@alenehs.edu.et" },
    update: {},
    create: {
      fullName: "Alene HS Admin",
      email: "admin@alenehs.edu.et",
      password: hashed,
      role: "admin",
    },
  });

  const defaultSettings: Record<string, string> = {
    schoolName: "Alene High School",
    schoolShortName: "Alene HS",
    schoolMotto: "Knowledge. Character. Innovation.",
    contactAddress: "Alene Sub-City, Addis Ababa, Ethiopia",
    contactPhone: "+251 11 234 5678",
    contactEmail: "info@alenehs.edu.et",
    contactHours: "Mon - Fri, 8:00 AM - 4:30 PM",

    heroSlide1Image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80",
    heroSlide1Title: "Welcome to Alene High School",
    heroSlide1Subtitle: "Shaping tomorrow's leaders through excellence in education.",
    heroSlide2Image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80",
    heroSlide2Title: "Innovation Through Science & Technology",
    heroSlide2Subtitle: "Our STEM Center empowers students to build, explore, and invent.",
    heroSlide3Image:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1920&q=80",
    heroSlide3Title: "A Community of Achievers",
    heroSlide3Subtitle: "Academics, arts, and athletics — a well-rounded student experience.",

    homeStemImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    aboutHeroImage:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80",
    hobbiesHeroImage:
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1600&q=80",
    stemHeroImage:
      "https://images.unsplash.com/photo-1581091870621-1e9b6b3f5c8b?auto=format&fit=crop&w=1600&q=80",

    stemGalleryImage1:
      "https://images.unsplash.com/photo-1581091870621-1e9b6b3f5c8b?auto=format&fit=crop&w=800&q=80",
    stemGalleryImage2:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    stemGalleryImage3:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    stemGalleryImage4:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=800&q=80",
    stemGalleryImage5:
      "https://images.unsplash.com/photo-1614064548237-096d9b32c5ba?auto=format&fit=crop&w=800&q=80",
    stemGalleryImage6:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",

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
  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  const programs = [
    {
      slug: "web-development",
      category: "stem-center",
      title: "Web Development",
      summary:
        "Modern web engineering — full-stack frameworks and dynamic applications built by students.",
      description:
        "The Web Development track teaches students to design, build, and ship real full-stack applications. Students learn HTML/CSS/JavaScript fundamentals before advancing into modern frameworks, REST APIs, and database-backed projects.",
      imageUrl:
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
      summary: "Mechatronics, Arduino/Raspberry Pi programming, and autonomous mechanical systems.",
      description:
        "Students in Robotics & Automation design and build physical machines that sense and act on the world — combining mechanical design, electronics, and embedded programming.",
      imageUrl:
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
      slug: "science-lab",
      category: "stem-center",
      title: "Science Lab",
      summary: "Laboratory experiments, genetics fundamentals, and environmental research.",
      description:
        "The Science Lab gives students hands-on laboratory experience across physics, chemistry, biology, genetics, and environmental science.",
      imageUrl:
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
        "Arts & Music brings together every visual and performing arts initiative at Alene High School — from painting and digital design workshops to choir and instrumental ensembles.",
      imageUrl:
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
        "Sports & Athletics unites all of the school's team sports, track and field, and fitness activities under one program.",
      imageUrl:
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
        "The Leadership & Student Body Council program trains students in governance, public speaking, and policy advocacy.",
      imageUrl:
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
        "Community Service connects students with local outreach and volunteer initiatives — from neighborhood clean-up drives to partnerships with local shelters and clinics.",
      imageUrl:
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
  for (const program of programs) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      update: {},
      create: program,
    });
  }

  console.log("Seed data created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
