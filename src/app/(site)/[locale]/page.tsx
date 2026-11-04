import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PARTNER_DEFAULTS, readPartners } from '@/types/content';
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
  const isKo = (await getLocale()) === 'ko';

  const partnerSettings = {
    ...PARTNER_DEFAULTS,
    ...settings.partners,
  };

  const partners = readPartners(partnerSettings).filter(
    (partner) =>
      partner.visible === 'true' && partner.name.trim(),
  );

  function partnerText(
    source: Record<string, string>,
    key: string,
  ) {
    return (
      source[`${key}_${isKo ? 'ko' : 'en'}`] ||
      source[`${key}_${isKo ? 'en' : 'ko'}`] ||
      ''
    );
  }

  function safeUrl(value: string | undefined, inquiry = false) {
    if (!value) return '';

    try {
      const url = new URL(value);
      const protocols = inquiry
        ? ['http:', 'https:', 'mailto:']
        : ['http:', 'https:'];

      return protocols.includes(url.protocol) ? value : '';
    } catch {
      return '';
    }
  }

  const partnerContact = safeUrl(
    partnerSettings.partner_contact_url,
    true,
  );

  const partnerStats = [
    {
      key: 'partner_entries',
      label: isKo ? '출전' : 'Entries',
    },
    {
      key: 'partner_podiums',
      label: isKo ? '포디움' : 'Podiums',
    },
    {
      key: 'partner_finish_rate',
      label: isKo ? '완주율' : 'Finish rate',
    },
  ];

  return (
    <>
      <HeroSection
        nextRace={nextRace}
        videoUrl={settings.hero_video_url}
      />

      {/* 팀 소개 */}
      <section className={`section ${styles.aboutSection}`}>
        <div className="container">
          <SectionHeading
            no={t('about.no')}
            label={t('about.label')}
            title={t('about.title')}
            desc={t('about.desc')}
          />
          <blockquote className={styles.aboutQuote}>
            Race Together.
            <br />
            <span className={styles.quoteOrange}>
              Improve Together.
            </span>
          </blockquote>
          <p className={styles.aboutText}>{tAbout('identity')}</p>
          <Link href="/about" className={styles.moreLink}>
            {tCommon('readMore')}
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </section>

      {/* 멤버 */}
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

      {/* 최근 경기 결과 */}
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

      {/* 소식 */}
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

      {/* 갤러리 */}
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

      {/* 스폰서 소개 · 모집 */}
      {partnerSettings.partners_visible === 'true' && (
        <section
          id="partners"
          className={`section ${styles.partnersSection}`}
        >
          <div className="container">
            <SectionHeading
              no="06"
              label="PARTNERS"
              title="OUR PARTNERS"
              desc={
                isKo
                  ? 'TRL Racing과 함께 달리는 파트너'
                  : 'Our partners on and off the track'
              }
            />

            <div className={styles.partnerList}>
              {partners.map((partner) => {
                const description = partnerText(
                  partner,
                  'description',
                );
                const activities = partnerText(
                  partner,
                  'activities',
                );
                const website = safeUrl(partner.url);

                return (
                  <article
                    key={partner.id}
                    className={styles.partnerCard}
                  >
                    <div className={styles.partnerLogo}>
                      {partner.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          loading="lazy"
                        />
                      ) : (
                        <strong>{partner.name}</strong>
                      )}
                    </div>

                    <div className={styles.partnerDetails}>
                      <span className={styles.partnerBadge}>
                        OFFICIAL PARTNER
                      </span>

                      <h3>{partner.name}</h3>

                      {description && <p>{description}</p>}

                      {(partner.since || activities) && (
                        <dl className={styles.partnerMeta}>
                          {partner.since && (
                            <div>
                              <dt>PARTNER SINCE</dt>
                              <dd>{partner.since}</dd>
                            </div>
                          )}
                          {activities && (
                            <div>
                              <dt>
                                {isKo
                                  ? '함께하는 곳'
                                  : 'TOGETHER ON'}
                              </dt>
                              <dd>{activities}</dd>
                            </div>
                          )}
                        </dl>
                      )}

                      {website && (
                        <a
                          className={styles.partnerLink}
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {partner.name}{' '}
                          {isKo ? '방문하기' : 'Visit'}
                          <ArrowRight size={18} aria-hidden />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {partnerSettings.partner_recruiting === 'true' && (
              <>
                <div className={styles.partnerVacancies}>
                  {Array.from(
                    { length: Math.max(0, 3 - partners.length) },
                    (_, index) => (
                      <a
                        key={index}
                        className={styles.partnerVacancy}
                        href="#partner-inquiry"
                      >
                        <strong>YOUR LOGO HERE</strong>
                        <span>
                          {isKo
                            ? '파트너 모집 중'
                            : 'Partners welcome'}
                        </span>
                      </a>
                    ),
                  )}
                </div>

                <div
                  id="partner-inquiry"
                  className={styles.partnerRecruitment}
                >
                  <div>
                    <h3>
                      {partnerText(
                        partnerSettings,
                        'partner_heading',
                      )}
                    </h3>
                    <p>
                      {partnerText(
                        partnerSettings,
                        'partner_intro',
                      )}
                    </p>
                  </div>

                  {partnerStats.some(
                    ({ key }) => partnerSettings[key],
                  ) && (
                    <dl className={styles.partnerStats}>
                      {partnerStats.map(
                        ({ key, label }) =>
                          partnerSettings[key] && (
                            <div key={key}>
                              <dd>
                                {partnerSettings[key]}
                                {key === 'partner_finish_rate'
                                  ? '%'
                                  : ''}
                              </dd>
                              <dt>{label}</dt>
                            </div>
                          ),
                      )}
                    </dl>
                  )}

                  <div>
                    {partnerContact ? (
                      <a
                        className={styles.partnerContact}
                        href={partnerContact}
                      >
                        {isKo
                          ? '파트너십 문의'
                          : 'Partnership inquiry'}
                        <ArrowRight size={18} aria-hidden />
                      </a>
                    ) : (
                      <span>
                        {isKo
                          ? '문의 채널 준비 중'
                          : 'Contact channel coming soon'}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <JoinTeamCTA recruiting={settings.recruiting} />
    </>
  );
}
