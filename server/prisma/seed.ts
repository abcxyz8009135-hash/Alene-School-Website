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
        programSlug: "biotechnology-applied-sciences",
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
