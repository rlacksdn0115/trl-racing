import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './JoinTeamCTA.module.css';

/** Join Us CTA 밴드 (design.md §28 홈 하단) */
export function JoinTeamCTA({ recruiting }: { recruiting: boolean }) {
  const t = useTranslations('join');

  if (!recruiting) return null;

  return (
    <section className={styles.band}>
      <div className={`container ${styles.inner}`}>
        <div>
          <p className={styles.status}>
            <span className={`${styles.dot} ${recruiting ? styles.open : styles.closed}`} aria-hidden />
            {recruiting ? t('recruiting') : t('notRecruiting')}
          </p>
          <h2 className={styles.headline}>{t('headline')}</h2>
          <p className={styles.desc}>{t('desc')}</p>
        </div>
        <Link href="/join" className={styles.cta}>
          {t('title')}
        </Link>
      </div>
    </section>
  );
}
