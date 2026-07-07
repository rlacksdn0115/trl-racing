import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import '@/app/globals.css';
import { fontBrand, fontData, fontDisplay } from '@/lib/fonts';
import { routing, type Locale } from '@/i18n/routing';
import { getSettings } from '@/lib/queries';
import { SiteHeader } from '@/components/SiteHeader/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter/SiteFooter';
import { AdminShortcut } from '@/components/AdminShortcut';
import { RevealObserver } from '@/components/RevealObserver';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const title = t('title');
  const description = t('description');
  const isKorean = locale === 'ko';
  const siteName = 'TRL Racing';
  const keywords = isKorean
    ? [
        'TRL Racing',
        'TorqueLINE Racing',
        '심레이싱',
        'e모터스포츠',
        '아이레이싱',
        'iRacing',
        '엔듀런스 레이스',
        '대한민국 심레이싱 팀',
        'Race Together Improve Together',
      ]
    : [
        'TRL Racing',
        'TorqueLINE Racing',
        'sim racing',
        'e-motorsports',
        'iRacing',
        'endurance racing',
        'South Korean sim racing team',
        'Race Together Improve Together',
      ];

  return {
    title: {
      default: title,
      template: `%s — ${siteName}`,
    },
    description,
    applicationName: siteName,
    category: 'sports',
    keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'website',
      siteName,
      title,
      description,
      locale: isKorean ? 'ko_KR' : 'en_US',
      alternateLocale: isKorean ? ['en_US'] : ['ko_KR'],
      images: [
        {
          url: '/brand/favicon.png',
          width: 567,
          height: 567,
          alt: 'TRL Racing logo',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: ['/brand/favicon.png'],
    },
    icons: {
      icon: '/brand/favicon.png',
      shortcut: '/brand/favicon.png',
      apple: '/brand/favicon.png',
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const settings = await getSettings();

  return (
    <html lang={locale}>
      <body
        className={`${fontDisplay.variable} ${fontData.variable} ${fontBrand.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          <SiteHeader recruiting={settings.recruiting} />
          <main>{children}</main>
          <SiteFooter />
          <AdminShortcut />
          <RevealObserver />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
