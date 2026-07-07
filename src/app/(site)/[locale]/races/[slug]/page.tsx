import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import {
  getAdjacentRaces,
  getGalleryImages,
  getNewsByRace,
  getRaceBySlug,
} from '@/lib/queries';
import {
  formatDateTime,
  formatRacePlatform,
  formatResultPosition,
  localized,
  toYouTubeEmbed,
} from '@/lib/utils';
import { RaceStatusBadge } from '@/components/RaceStatusBadge/RaceStatusBadge';
import { RaceCountdown } from '@/components/RaceCountdown/RaceCountdown';
import { TrackMap } from '@/components/TrackMap/TrackMap';
import { NewsCard } from '@/components/NewsCard/NewsCard';
import { GalleryGrid } from '@/components/GalleryGrid/GalleryGrid';
import styles from './page.module.css';

export async function generateMetadata({
  params: { slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const race = await getRaceBySlug(slug);
  if (!race) return { title: 'TRL Racing' };
  return { title: `${race.title_en} — TRL Racing` };
}

export default async function RaceDetailPage({
  params: { slug },
}: {
  params: { locale: string; slug: string };
}) {
  const race = await getRaceBySlug(slug);
  if (!race) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('race');
  const [news, gallery, adjacent] = await Promise.all([
    getNewsByRace(race.id),
    getGalleryImages({ raceId: race.id }),
    getAdjacentRaces(race),
  ]);

  const description = localized(race, 'description', locale);
  const review = localized(race, 'review', locale);
  const circuitInfo = localized(race, 'circuit_info', locale);
  const embed = race.youtube_url ? toYouTubeEmbed(race.youtube_url) : null;
  const isFinished = race.status === 'completed';
  const showCountdown = race.status === 'upcoming' || race.status === 'live';

  const infoRows = [
    { label: t('startsAt'), value: formatDateTime(race.starts_at, locale) },
    { label: t('platform'), value: formatRacePlatform(race.platform) },
    { label: t('series'), value: race.series },
    { label: t('circuit'), value: race.circuit_name },
    { label: t('length'), value: race.race_length },
    { label: t('carClass'), value: race.car_class },
    {
      label: t('entryCars'),
      value: race.cars.map((c) => c.name).join(', ') || null,
    },
  ].filter((row) => row.value);

  const resultRows = race.result
    ? [
        {
          label: t('overall'),
          value: formatResultPosition(race.result.overall_pos, race.result.finish_status),
        },
        {
          label: t('classPos'),
          value: formatResultPosition(race.result.class_pos, race.result.finish_status),
        },
        {
          label: t('qualifying'),
          value: formatResultPosition(
            race.result.qualifying_pos,
            race.result.finish_status,
          ),
        },
        { label: t('fastestLap'), value: race.result.fastest_lap ?? '—' },
        {
          label: t('incidents'),
          value: race.result.incidents != null ? `${race.result.incidents}x` : '—',
        },
        { label: t('finishStatus'), value: race.result.finish_status ?? '—' },
      ]
    : [];

  return (
    <>
      {/* Race Header (design.md §14) */}
      <section className={styles.hero}>
        <div className={styles.heroTrack} aria-hidden>
          <TrackMap src={race.track_map_url} name={race.circuit_name} decorative />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroMeta}>
            <RaceStatusBadge status={race.status} />
            {race.series && <span className={styles.series}>{race.series}</span>}
          </div>
          <h1 className={styles.title}>{race.title_en}</h1>
          <p className={styles.heroSub}>
            {formatDateTime(race.starts_at, locale)}
            {race.circuit_name && ` · ${race.circuit_name}`}
          </p>

          {showCountdown && (
            <div className={styles.countdown}>
              <RaceCountdown startsAt={race.starts_at} />
            </div>
          )}

          {isFinished && race.result && (
            <p className={styles.bigResult}>
              <span className={styles.bigResultPos}>
                {formatResultPosition(race.result.overall_pos, race.result.finish_status)}
              </span>
              <span className={styles.bigResultLabel}>{t('overall')}</span>
            </p>
          )}
        </div>
      </section>

      <section className={`section ${styles.body}`}>
        <div className={`container ${styles.bodyGrid}`}>
          <div className={styles.main}>
            {embed && (
              <div className={styles.videoBlock}>
                <h2 className={styles.blockTitle}>{t('video')}</h2>
                <div className={styles.videoFrame}>
                  <iframe
                    src={embed}
                    title={race.title_en}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {description && (
              <div className={styles.textBlock}>
                <h2 className={styles.blockTitle}>{t('description')}</h2>
                <p className={styles.text}>{description}</p>
              </div>
            )}

            {isFinished && resultRows.length > 0 && (
              <div className={styles.textBlock}>
                <h2 className={styles.blockTitle}>{t('resultTitle')}</h2>
                <dl className={styles.resultGrid}>
                  {resultRows.map((row) => (
                    <div key={row.label} className={styles.resultCell}>
                      <dt className={styles.resultLabel}>{row.label}</dt>
                      <dd className={styles.resultValue}>{row.value}</dd>
                    </div>
                  ))}
                </dl>
                {race.result?.notes_ko && (
                  <p className={styles.text}>{localized(race.result, 'notes', locale)}</p>
                )}
              </div>
            )}

            {review && (
              <div className={styles.textBlock}>
                <h2 className={styles.blockTitle}>{t('review')}</h2>
                <p className={styles.text}>{review}</p>
              </div>
            )}

            {gallery.length > 0 && (
              <div className={styles.textBlock}>
                <h2 className={styles.blockTitle}>{t('relatedGallery')}</h2>
                <GalleryGrid images={gallery} />
              </div>
            )}

            {news.length > 0 && (
              <div className={styles.textBlock}>
                <h2 className={styles.blockTitle}>{t('relatedNews')}</h2>
                <div className={styles.newsGrid}>
                  {news.map((post) => (
                    <NewsCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side info — 타이밍 스크린 스타일 */}
          <aside className={styles.side}>
            <div className={styles.sideCard}>
              <div className={styles.sideTrack} aria-hidden>
                <TrackMap src={race.track_map_url} name={race.circuit_name} decorative active />
              </div>
              <dl className={styles.sideList}>
                {infoRows.map((row) => (
                  <div key={row.label} className={styles.sideRow}>
                    <dt className={styles.sideLabel}>{row.label}</dt>
                    <dd className={styles.sideValue}>{row.value}</dd>
                  </div>
                ))}
              </dl>
              {circuitInfo && <p className={styles.circuitInfo}>{circuitInfo}</p>}
            </div>

            {race.members.length > 0 && (
              <div className={styles.sideCard}>
                <h2 className={styles.sideTitle}>{t('entryDrivers')}</h2>
                <ul className={styles.driverList}>
                  {race.members.map((member) => (
                    <li key={member.id}>
                      <Link href={`/members/${member.slug}`} className={styles.driverLink}>
                        <span className={styles.driverNo}>{member.racing_number}</span>
                        {member.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* 이전 / 다음 경기 */}
      <nav className={styles.pager} aria-label="Race navigation">
        <div className={`container ${styles.pagerInner}`}>
          {adjacent.prev ? (
            <Link href={`/races/${adjacent.prev.slug}`} className={styles.pagerLink}>
              <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
              <span>
                <span className={styles.pagerLabel}>{t('prevRace')}</span>
                {localized(adjacent.prev, 'title', locale)}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {adjacent.next ? (
            <Link
              href={`/races/${adjacent.next.slug}`}
              className={`${styles.pagerLink} ${styles.pagerNext}`}
            >
              <span>
                <span className={styles.pagerLabel}>{t('nextRace')}</span>
                {localized(adjacent.next, 'title', locale)}
              </span>
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>
    </>
  );
}
