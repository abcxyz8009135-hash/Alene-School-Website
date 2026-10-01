import Hero from "@/components/home/Hero";
import MottoSection from "@/components/home/MottoSection";
import AcademicsSection from "@/components/home/AcademicsSection";
import StemSection from "@/components/home/StemSection";
import AchievementSection from "@/components/home/AchievementSection";
import CommunitySection from "@/components/home/CommunitySection";
import NewsSection from "@/components/home/NewsSection";
import ExamResultsCTA from "@/components/ExamResultsCTA";
import { ACHIEVEMENT_SLOTS } from "@/lib/content";
import { getNews } from "@/lib/news";
import { fetchAchievements } from "@/lib/programs";
import { fetchSettings } from "@/lib/settings";

// ISR: news, achievements and settings are revalidated every 60 seconds.
export const revalidate = 60;

export default async function HomePage() {
  const [settings, news, achievementLists] = await Promise.all([
    fetchSettings(),
    getNews(),
    Promise.all(ACHIEVEMENT_SLOTS.map((slot) => fetchAchievements(slot.programSlug))),
  ]);

  const achievementSlots = ACHIEVEMENT_SLOTS.map((slot, i) => ({
    label: slot.label,
    achievement: achievementLists[i][0],
  }));

  return (
    <>
      <Hero image={settings.homeHeroImage} />
      <MottoSection />
      <AcademicsSection image={settings.homeAcademicsImage} />
      <StemSection image={settings.homeStemImage} insetImage={settings.stemHeroImage} />
      <AchievementSection image={settings.homeAchievementImage} slots={achievementSlots} />
      <CommunitySection
        primaryImage={settings.homeCommunityImage1}
        secondaryImage={settings.homeCommunityImage2}
      />
      <NewsSection articles={news.slice(0, 4)} />
      <ExamResultsCTA />
    </>
  );
}
