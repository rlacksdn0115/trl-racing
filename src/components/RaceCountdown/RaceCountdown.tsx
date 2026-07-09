'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import styles from './RaceCountdown.module.css';

function diff(target: string) {
  const total = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    //seconds: Math.floor((total / 1_000) % 60),
    done: total === 0,
  };
}

/**
 * 실시간 카운트다운 (design.md §10.3).
 * 스크린리더가 매초 읽지 않도록 컨테이너에 라벨만 두고 숫자는 aria-hidden.
 */
export function RaceCountdown({ startsAt }: { startsAt: string }) {
  const t = useTranslations('nextRace');
  // SSR/hydration 불일치 방지 — 마운트 후에만 실시간 값 표시
  const [time, setTime] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setTime(diff(startsAt));
    const id = setInterval(() => setTime(diff(startsAt)), 1000);
    return () => clearInterval(id);
  }, [startsAt]);

  const units = [
    { key: 'days', value: time?.days },
    { key: 'hours', value: time?.hours },
    { key: 'minutes', value: time?.minutes },
    //{ key: 'seconds', value: time?.seconds },
  ] as const;

  return (
    <div className={styles.countdown} role="timer" aria-label={t('countdownAria')}>
      <div className={styles.units} aria-hidden>
        {units.map((u) => (
          <div key={u.key} className={styles.unit}>
            <span className={styles.value}>
              {u.value == null ? '--' : String(u.value).padStart(2, '0')}
            </span>
            <span className={styles.label}>{t(u.key)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
