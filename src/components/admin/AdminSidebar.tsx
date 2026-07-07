'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Car,
  Flag,
  Image as ImageIcon,
  LayoutDashboard,
  Newspaper,
  Settings,
  Users,
} from 'lucide-react';
import { signOut } from '@/lib/admin/actions';
import styles from './AdminSidebar.module.css';

const NAV = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard, exact: true },
  { href: '/admin/races', label: '경기', icon: Flag },
  { href: '/admin/members', label: '멤버', icon: Users },
  { href: '/admin/news', label: '소식', icon: Newspaper },
  { href: '/admin/gallery', label: '갤러리', icon: ImageIcon },
  { href: '/admin/cars', label: '차량', icon: Car },
  { href: '/admin/settings', label: '설정', icon: Settings },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href="/admin" className={styles.logo}>
        <Image src="/brand/logo-dark.png" alt="TRL Racing Admin" width={84} height={58} />
      </Link>

      <nav className={styles.nav} aria-label="Admin">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${active ? styles.active : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={16} strokeWidth={1.75} aria-hidden />
              <span className={styles.linkLabel}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <p className={styles.email}>{email}</p>
        <div className={styles.footerActions}>
          <Link href="/" className={styles.footerLink} target="_blank">
            사이트 보기
          </Link>
          <form action={signOut}>
            <button type="submit" className={styles.footerLink}>
              로그아웃
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
