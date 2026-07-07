import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/PageHero/PageHero';
import { JoinTeamCTA } from '@/components/JoinTeamCTA/JoinTeamCTA';
import { getSettings } from '@/lib/queries';
import styles from './page.module.css';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: `${t('title')} — TRL Racing` };
}

export default async function AboutPage() {
  const t = await getTranslations('about');
  const settings = await getSettings();

  const philosophies = [
    { title: t('philosophy1Title'), body: t('philosophy1') },
    { title: t('philosophy2Title'), body: t('philosophy2') },
    { title: t('philosophy3Title'), body: t('philosophy3') },
  ];
  const activities = [
    { title: t('activity1Title'), body: t('activity1') },
    { title: t('activity2Title'), body: t('activity2') },
    { title: t('activity3Title'), body: t('activity3') },
  ];

  return (
    <>
      <PageHero label={t('heroLabel')} title={t('title')} desc={t('identity')} />

      {/* 대형 인용문 — 긴 소개문을 한 덩어리로 두지 않는다 (design.md §17) */}
      <section className={`section ${styles.quoteSection}`}>
        <div className="container">
          <blockquote className={styles.bigQuote}>
            Race Together.
            <br />
            <span className={styles.orange}>Improve Together.</span>
          </blockquote>
          <p className={styles.quoteBody}>{t('activity')}</p>
        </div>
      </section>

      <section className={`section ${styles.blockSection}`}>
        <div className="container">
          <h2 className={styles.blockTitle}>{t('philosophyTitle')}</h2>
          <div className={styles.cardGrid}>
            {philosophies.map((item, i) => (
              <article key={item.title} className={styles.card}>
                <span className={styles.cardNo}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardBody}>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.altSection}`}>
        <div className="container">
          <h2 className={styles.blockTitle}>{t('activityTitle')}</h2>
          <div className={styles.cardGrid}>
            {activities.map((item, i) => (
              <article key={item.title} className={styles.card}>
                <span className={styles.cardNo}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardBody}>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.blockSection}`}>
        <div className="container">
          <h2 className={styles.blockTitle}>{t('valuesTitle')}</h2>
          <p className={styles.values}>{t('values')}</p>
          <p className={styles.culture}>{t('culture')}</p>

          <h2 className={`${styles.blockTitle} ${styles.visionTitle}`}>{t('visionTitle')}</h2>
          <p className={styles.vision}>{t('vision')}</p>
        </div>
      </section>

      <JoinTeamCTA recruiting={settings.recruiting} />
    </>
  );
}
