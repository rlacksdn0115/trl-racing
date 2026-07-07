import { useTranslations } from 'next-intl';
import type { RaceStatus } from '@/types/content';
import styles from './RaceStatusBadge.module.css';

/** 경기 상태 배지 (design.md §10.3) — 색상 + 텍스트로 상태 구분 */
export function RaceStatusBadge({ status }: { status: RaceStatus }) {
  const t = useTranslations('raceStatus');

  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {status === 'live' && <span className={styles.pulse} aria-hidden />}
      {t(status)}
    </span>
  );
}
