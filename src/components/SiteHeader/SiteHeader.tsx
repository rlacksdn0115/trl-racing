'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import styles from './SiteHeader.module.css';

const NAV_ITEMS = [
  { key: 'about', href: '/about' },
  { key: 'members', href: '/members' },
  { key: 'schedule', href: '/schedule' },
  { key: 'results', href: '/results' },
  { key: 'news', href: '/news' },
  { key: 'gallery', href: '/gallery' },
] as const;

export function SiteHeader({ recruiting }: { recruiting: boolean }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function toggleLocale() {
    router.replace(pathname, { locale: locale === 'ko' ? 'en' : 'ko' });
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="TRL Racing Home">
          <Image
            src="/brand/logo-dark.png"
            alt="TRL Racing"
            width={110}
            height={76}
            priority
            className={styles.logoImg}
          />
        </Link>

        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.langToggle}
            onClick={toggleLocale}
            aria-label={t('langToggleAria')}
          >
            {t('langToggle')}
          </button>
          {recruiting && (
            <Link href="/join" className={styles.joinCta}>
              {t('join')}
            </Link>
          )}
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t('close') : t('menu')}
          >
            {menuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (design.md §9.2) */}
      <div id="mobile-nav" className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <nav aria-label="Mobile">
          <ul className={styles.drawerList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`${styles.drawerLink} ${isActive(item.href) ? styles.active : ''}`}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
            {recruiting && (
              <li>
                <Link href="/join" className={`${styles.drawerLink} ${styles.drawerJoin}`}>
                  {t('join')}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
