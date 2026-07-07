import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './not-found.module.css';

export default function NotFoundPage() {
  const t = useTranslations('notFound');

  return (
    <section className={styles.wrap}>
      <div className="container">
        <p className={styles.code} aria-hidden>
          404
        </p>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.desc}>{t('desc')}</p>
        <Link href="/" className={styles.back}>
          {t('backHome')}
        </Link>
      </div>
    </section>
  );
}
