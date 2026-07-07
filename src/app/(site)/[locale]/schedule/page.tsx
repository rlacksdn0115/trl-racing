import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getRaces } from '@/lib/queries';
import { PageHero } from '@/components/PageHero/PageHero';
import { RaceScheduleCard } from '@/components/RaceScheduleCard/RaceScheduleCard';
import styles from './page.module.css';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: `${t('schedule')} — TRL Racing` };
}

export default async function SchedulePage() {
  const t = await getTranslations('schedule');
  const races = await getRaces();

  const upcoming = races
    .filter((r) => r.status === 'upcoming' || r.status === 'live')
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
  const past = races.filter((r) => r.status === 'completed' || r.status === 'cancelled');

  return (
    <>
      <PageHero label="SCHEDULE" title={t('title')} desc={t('desc')} />

      <section className="section">
        <div className="container">
          <h2 className={styles.groupTitle}>{t('upcoming')}</h2>
          {upcoming.length > 0 ? (
            <div className={styles.list}>
              {upcoming.map((race) => (
                <RaceScheduleCard key={race.id} race={race} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>{t('emptyUpcoming')}</p>
          )}

          {past.length > 0 && (
            <>
              <h2 className={`${styles.groupTitle} ${styles.pastTitle}`}>
                {t('completed')}
              </h2>
              <div className={styles.list}>
                {past.map((race) => (
                  <RaceScheduleCard key={race.id} race={race} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
