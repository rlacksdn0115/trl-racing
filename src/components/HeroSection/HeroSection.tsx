import { useTranslations } from 'next-intl';
import type { Race } from '@/types/content';
import { parseUrlList } from '@/lib/utils';
import { NextRaceCard } from '@/components/NextRaceCard/NextRaceCard';
import { HeroVideo } from './HeroVideo';
import styles from './HeroSection.module.css';

/** Hero (design.md §10) — TRL / RACING 2줄 타이틀 + 다음 경기 카드 + 영상/정적 배경 */
export function HeroSection({
  nextRace,
  videoUrl,
}: {
  nextRace: Race | null;
  videoUrl: string;
}) {
  const t = useTranslations('hero');
  const tNext = useTranslations('nextRace');
  const videoUrls = parseUrlList(videoUrl);

  return (
    <section className={styles.hero}>
      {/* 배경 레이어: 영상(옵션) → 오버레이 → 레이싱 라인 */}
      {videoUrls.length > 0 && <HeroVideo urls={videoUrls} />}
      <div className={styles.overlay} aria-hidden />
      <svg
        className={styles.racingLine}
        viewBox="0 0 1440 600"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M-40 520 C 240 500 320 360 560 380 C 800 400 860 220 1120 240 C 1300 254 1380 180 1480 120"
          stroke="var(--trl-orange)"
          strokeWidth="2"
          opacity="0.6"
        />
      </svg>

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{t('eyebrow')}</p>
          <h1 className={styles.title}>
            <span className={styles.titleWhite}>TRL</span>
            <span className={styles.titleOrange}>RACING</span>
          </h1>
          <p className={styles.subLabel}>{t('subLabel')}</p>
          <p className={styles.slogan}>{t('slogan')}</p>
          <p className={styles.intro}>{t('intro')}</p>
        </div>

        <div className={styles.raceCard}>
          {nextRace ? (
            <NextRaceCard race={nextRace} />
          ) : (
            <p className={styles.noRace}>{tNext('noRace')}</p>
          )}
        </div>
      </div>

      <div className={styles.scrollIndicator} aria-hidden>
        <span className={styles.scrollLabel}>{t('scroll')}</span>
        <span className={styles.scrollBar} />
      </div>
    </section>
  );
}
