import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Race } from '@/types/content';
import { formatDateTime, formatRacePlatform, formatResultPosition } from '@/lib/utils';
import { RaceStatusBadge } from '@/components/RaceStatusBadge/RaceStatusBadge';
import { TrackMap } from '@/components/TrackMap/TrackMap';
import styles from './RaceScheduleCard.module.css';

/** 일정 카드 (design.md §13) — 좌측 날짜 / 중앙 정보 / 우측 트랙맵·상태 */
export function RaceScheduleCard({ race }: { race: Race }) {
  const t = useTranslations('race');
  const locale = useLocale() as Locale;
  const date = new Date(race.starts_at);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return (
    <Link href={`/races/${race.slug}`} className={styles.card}>
      <div className={styles.date} aria-hidden>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>
          {month} / {date.getFullYear()}
        </span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{race.title_en}</h3>
        <p className={styles.meta}>
          <span>{formatDateTime(race.starts_at, locale)}</span>
          <span>{formatRacePlatform(race.platform)}</span>
          {race.circuit_name && <span>{race.circuit_name}</span>}
          {race.car_class && <span>{race.car_class}</span>}
          {race.race_length && <span>{race.race_length}</span>}
        </p>
        {race.members.length > 0 && (
          <p className={styles.lineup}>
            <span className={styles.lineupLabel}>{t('entryDrivers')}</span>{' '}
            {race.members.map((m) => m.name).join(', ')}
          </p>
        )}
      </div>

      <div className={styles.side}>
        <div className={styles.trackMap} aria-hidden>
          <TrackMap src={race.track_map_url} name={race.circuit_name} decorative />
        </div>
        <div className={styles.status}>
          <RaceStatusBadge status={race.status} />
          {race.result && (
            <span className={styles.position}>
              {formatResultPosition(race.result.overall_pos, race.result.finish_status)}
            </span>
          )}
        </div>
        <ArrowRight size={18} strokeWidth={1.75} className={styles.arrow} aria-hidden />
      </div>
    </Link>
  );
}
