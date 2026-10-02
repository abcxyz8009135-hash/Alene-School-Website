import Hero from "@/components/home/Hero";
import MottoSection from "@/components/home/MottoSection";
import AcademicsSection from "@/components/home/AcademicsSection";
import StemSection from "@/components/home/StemSection";
import AchievementSection from "@/components/home/AchievementSection";
import CommunitySection from "@/components/home/CommunitySection";
import NewsSection from "@/components/home/NewsSection";
import ExamResultsCTA from "@/components/ExamResultsCTA";
import { getContent } from "@/lib/content";
import { getNews } from "@/lib/news";
import { fetchAchievements } from "@/lib/programs";
import { fetchSettings } from "@/lib/settings";

// ISR: news, achievements and settings are revalidated every 60 seconds.
export const revalidate = 60;

export default async function HomePage() {
  const [settings, content, news] = await Promise.all([fetchSettings(), getContent(), getNews()]);
  const slotConfig = content.list("home.achievements.slots").filter((s) => s.programSlug);
  const achievementLists = await Promise.all(slotConfig.map((slot) => fetchAchievements(slot.programSlug)));

  const achievementSlots = slotConfig.map((slot, i) => ({
    label: slot.label,
    achievement: achievementLists[i][0],
  }));

  return (
    <>
      <Hero image={settings.homeHeroImage} content={content} />
      <MottoSection content={content} />
      <AcademicsSection image={settings.homeAcademicsImage} content={content} />
      <StemSection image={settings.homeStemImage} insetImage={settings.stemHeroImage} content={content} />
      <AchievementSection image={settings.homeAchievementImage} slots={achievementSlots} content={content} />
      <CommunitySection
        primaryImage={settings.homeCommunityImage1}
        secondaryImage={settings.homeCommunityImage2}
        content={content}
      />
      <NewsSection articles={news.slice(0, 4)} content={content} />
      <ExamResultsCTA />
    </>
  );
}
