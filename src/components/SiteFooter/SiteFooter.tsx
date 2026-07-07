import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSettings } from '@/lib/queries';
import styles from './SiteFooter.module.css';

const FOOTER_LINKS = [
  { key: 'about', href: '/about' },
  { key: 'members', href: '/members' },
  { key: 'schedule', href: '/schedule' },
  { key: 'results', href: '/results' },
  { key: 'news', href: '/news' },
  { key: 'gallery', href: '/gallery' },
] as const;

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');
  const settings = await getSettings();

  const socials = [
    { label: 'Instagram', url: settings.instagram_url },
    { label: 'Discord', url: settings.discord_url },
    { label: 'YouTube', url: settings.youtube_url },
  ].filter((s) => s.url);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Image
            src="/brand/logo-dark.png"
            alt="TorqueLINE Racing"
            width={140}
            height={97}
            className={styles.logo}
          />
          <p className={styles.fullName}>{t('fullName')}</p>
          <p className={styles.tagline}>{t('tagline')}</p>
          <p className={styles.slogan}>{t('slogan')}</p>
        </div>

        <nav className={styles.column} aria-label="Footer">
          <h2 className={styles.columnTitle}>{t('linksTitle')}</h2>
          <ul className={styles.linkList}>
            {FOOTER_LINKS.map((link) => (
              <li key={link.key}>
                <Link href={link.href} className={styles.link}>
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>{t('socialTitle')}</h2>
          <ul className={styles.linkList}>
            {socials.length > 0 ? (
              socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))
            ) : (
              <li className={styles.muted}>—</li>
            )}
            {settings.contact_url && (
              <li>
                <a
                  href={settings.contact_url}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('contact')}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.copyright}>
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
        {/* 관리자 진입 수단 (feature.md §15) — 눈에 띄지 않는 텍스트 링크 */}
        <a href="/admin" className={styles.adminLink}>
          admin
        </a>
      </div>
    </footer>
  );
}
