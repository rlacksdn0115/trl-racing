import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Race } from '@/types/content';
import { formatDate, formatResultPosition, isDnf } from '@/lib/utils';
import styles from './RaceResultTable.module.css';

/**
 * 결과 표 (design.md §14) — 타이밍 스크린 스타일.
 * 데스크톱은 표, 모바일은 CSS로 카드형 전환. P1은 오렌지 포인트.
 */
export function RaceResultTable({ races }: { races: Race[] }) {
  const t = useTranslations('results');

  if (races.length === 0) {
    return <p className={styles.empty}>{t('empty')}</p>;
  }

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          <th scope="col">{t('date')}</th>
          <th scope="col">{t('event')}</th>
          <th scope="col">{t('class')}</th>
          <th scope="col">{t('drivers')}</th>
          <th scope="col" className={styles.posHead}>
            {t('qualifying')}
          </th>
          <th scope="col" className={styles.posHead}>
            {t('position')}
          </th>
        </tr>
      </thead>
      <tbody>
        {races.map((race) => {
          const pos = race.result?.overall_pos ?? null;
          const finishStatus = race.result?.finish_status ?? null;
          return (
            <tr key={race.id} className={styles.row}>
              <td data-label={t('date')} className={styles.date}>
                {formatDate(race.starts_at)}
              </td>
              <td data-label={t('event')} className={styles.event}>
                <Link href={`/races/${race.slug}`} className={styles.eventLink}>
                  {race.title_en}
                </Link>
              </td>
              <td data-label={t('class')} className={styles.class}>
                {race.car_class ?? '—'}
              </td>
              <td data-label={t('drivers')} className={styles.drivers}>
                {race.members.map((m) => m.name).join(', ') || '—'}
              </td>
              <td data-label={t('qualifying')} className={`${styles.pos} ${styles.finalPos}`}>
                {formatResultPosition(race.result?.qualifying_pos ?? null, finishStatus)}
              </td>
              <td
                data-label={t('position')}
                className={`${styles.pos} ${styles.finalPos} ${pos === 1 && !isDnf(finishStatus) ? styles.p1 : ''} ${pos != null && pos <= 3 && !isDnf(finishStatus) ? styles.podium : ''}`}
              >
                {formatResultPosition(pos, finishStatus)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
