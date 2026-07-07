import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Race } from '@/types/content';
import { formatDateTime, formatRacePlatform } from '@/lib/utils';
import { RaceCountdown } from '@/components/RaceCountdown/RaceCountdown';
import { RaceStatusBadge } from '@/components/RaceStatusBadge/RaceStatusBadge';
import { TrackMap } from '@/components/TrackMap/TrackMap';
import styles from './NextRaceCard.module.css';

/** Hero 내 다음 경기 카드 (design.md §10.3) */
export function NextRaceCard({ race }: { race: Race }) {
  const t = useTranslations('nextRace');
  const locale = useLocale() as Locale;

  const infoRows = [
    { label: t('platform'), value: formatRacePlatform(race.platform) },
    { label: t('circuit'), value: race.circuit_name },
    { label: t('length'), value: race.race_length },
    { label: t('carClass'), value: race.car_class },
    {
      label: t('lineup'),
      value: race.members.map((m) => m.name).join(', ') || null,
    },
  ].filter((row) => row.value);

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.label}>{t('label')}</span>
        <RaceStatusBadge status={race.status} />
      </header>

      <div className={styles.body}>
        <div className={styles.main}>
          <h3 className={styles.title}>
            <Link href={`/races/${race.slug}`} className={styles.titleLink}>
              {race.title_en}
            </Link>
          </h3>
          <p className={styles.startsAt}>
            <span className={styles.startsAtLabel}>{t('startsAt')}</span>{' '}
            {formatDateTime(race.starts_at, locale)}
          </p>
          {race.status !== 'completed' && race.status !== 'cancelled' && (
            <RaceCountdown startsAt={race.starts_at} />
          )}
        </div>

        <div className={styles.track} aria-hidden>
          <TrackMap src={race.track_map_url} name={race.circuit_name} decorative active />
        </div>

        <dl className={styles.info}>
          {infoRows.map((row) => (
            <div key={row.label} className={styles.infoRow}>
              <dt className={styles.infoLabel}>{row.label}</dt>
              <dd className={styles.infoValue}>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
