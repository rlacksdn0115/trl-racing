import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { getSettings } from '@/lib/queries';
import { PageHero } from '@/components/PageHero/PageHero';
import styles from './page.module.css';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'join' });
  return { title: `${t('title')} — TRL Racing` };
}

export default async function JoinPage() {
  const t = await getTranslations('join');
  const settings = await getSettings();

  const conditions = [t('condition1'), t('condition2'), t('condition3')];
  const channels = [
    { label: 'Discord', url: settings.discord_url },
    { label: 'Instagram', url: settings.instagram_url },
    { label: t('contactTitle'), url: settings.contact_url },
  ].filter((c) => c.url);

  return (
    <>
      <PageHero label="JOIN US" title={t('headline')} desc={t('desc')} />

      <section className="section">
        <div className="container">
          <p className={styles.status}>
            <span
              className={`${styles.dot} ${settings.recruiting ? styles.open : styles.closed}`}
              aria-hidden
            />
            {settings.recruiting ? t('recruiting') : t('notRecruiting')}
          </p>

          <h2 className={styles.blockTitle}>{t('conditionsTitle')}</h2>
          <ul className={styles.conditions}>
            {conditions.map((condition) => (
              <li key={condition} className={styles.condition}>
                <CheckCircle2
                  size={18}
                  strokeWidth={1.75}
                  className={styles.check}
                  aria-hidden
                />
                {condition}
              </li>
            ))}
          </ul>

          <h2 className={styles.blockTitle}>{t('contactTitle')}</h2>
          <p className={styles.contactDesc}>{t('contactDesc')}</p>
          {channels.length > 0 ? (
            <div className={styles.channels}>
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.channel}
                >
                  {channel.label}
                  <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
                </a>
              ))}
            </div>
          ) : (
            /* 채널 미등록 시 — CMS 설정에서 입력 (TRL.md §13 미확정 항목) */
            <p className={styles.channelPlaceholder}>—</p>
          )}
        </div>
      </section>
    </>
  );
}
