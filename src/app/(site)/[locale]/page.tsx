import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import {
  getGalleryImages,
  getMembers,
  getNewsList,
  getNextRace,
  getRecentResults,
  getSettings,
} from '@/lib/queries';
import { HeroSection } from '@/components/HeroSection/HeroSection';
import { SectionHeading } from '@/components/SectionHeading/SectionHeading';
import { DriverCard } from '@/components/DriverCard/DriverCard';
import { RaceResultTable } from '@/components/RaceResultTable/RaceResultTable';
import { NewsCard } from '@/components/NewsCard/NewsCard';
import { GalleryGrid } from '@/components/GalleryGrid/GalleryGrid';
import { JoinTeamCTA } from '@/components/JoinTeamCTA/JoinTeamCTA';
import styles from './page.module.css';

export default async function HomePage() {
  const [nextRace, members, recentResults, news, gallery, settings] =
    await Promise.all([
      getNextRace(),
      getMembers(),
      getRecentResults(4),
      getNewsList(),
      getGalleryImages({ limit: 5 }),
      getSettings(),
    ]);

  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');
  const tAbout = await getTranslations('about');

  return (
    <>
      <HeroSection nextRace={nextRace} videoUrl={settings.hero_video_url} />

      {/* About preview — bg: --trl-black */}
      <section className={`section ${styles.aboutSection}`}>
        <div className="container">
          <SectionHeading
            no={t('about.no')}
            label={t('about.label')}
            title={t('about.title')}
            desc={t('about.desc')}
          />
          <blockquote className={styles.aboutQuote}>
            Race Together.<br />
            <span className={styles.quoteOrange}>Improve Together.</span>
          </blockquote>
          <p className={styles.aboutText}>{tAbout('identity')}</p>
          <Link href="/about" className={styles.moreLink}>
            {tCommon('readMore')}
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </section>

      {/* Members preview — bg: --trl-charcoal */}
      <section className={`section ${styles.membersSection}`}>
        <div className="container">
          <SectionHeading
            no={t('members.no')}
            label={t('members.label')}
            title={t('members.title')}
            desc={t('members.desc')}
          />
          <div className={styles.driverGrid}>
            {members.map((member) => (
              <DriverCard key={member.id} member={member} />
            ))}
          </div>
          <Link href="/members" className={styles.moreLink}>
            {tCommon('viewAll')}
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </section>

      {/* Recent results — bg: --trl-surface tone */}
      <section className={`section ${styles.resultsSection}`}>
        <div className="container">
          <SectionHeading
            no={t('results.no')}
            label={t('results.label')}
            title={t('results.title')}
            desc={t('results.desc')}
          />
          <RaceResultTable races={recentResults} />
          <Link href="/results" className={styles.moreLink}>
            {tCommon('viewAll')}
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </section>

      {/* News — bg: --trl-black */}
      <section className={`section ${styles.newsSection}`}>
        <div className="container">
          <SectionHeading
            no={t('news.no')}
            label={t('news.label')}
            title={t('news.title')}
            desc={t('news.desc')}
          />
          {news.length > 0 && (
            <div className={styles.newsGrid}>
              <div className={styles.newsFeatured}>
                <NewsCard post={news[0]} featured />
              </div>
              <div className={styles.newsRest}>
                {news.slice(1, 4).map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
          <Link href="/news" className={styles.moreLink}>
            {tCommon('viewAll')}
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </section>

      {/* Gallery preview — bg: --trl-charcoal */}
      <section className={`section ${styles.gallerySection}`}>
        <div className="container">
          <SectionHeading
            no={t('gallery.no')}
            label={t('gallery.label')}
            title={t('gallery.title')}
            desc={t('gallery.desc')}
          />
          <GalleryGrid images={gallery} />
          <Link href="/gallery" className={styles.moreLink}>
            {tCommon('viewAll')}
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </section>

      <JoinTeamCTA recruiting={settings.recruiting} />
    </>
  );
}
