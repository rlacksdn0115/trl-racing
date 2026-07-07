import type { Metadata } from 'next';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import '@/app/globals.css';
import './admin.css';
import { fontBrand, fontData, fontDisplay } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'TRL Racing Admin',
  robots: { index: false, follow: false },
  icons: {
    icon: '/brand/favicon.png',
    shortcut: '/brand/favicon.png',
    apple: '/brand/favicon.png',
  },
};

/** CMS 루트 레이아웃 — 관리자 UI는 한국어 고정 (design.md §24) */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body
        className={`${fontDisplay.variable} ${fontData.variable} ${fontBrand.variable} admin-body`}
      >
        {children}
      </body>
    </html>
  );
}
