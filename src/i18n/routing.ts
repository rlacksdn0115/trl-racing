import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko',
  // 한국어는 `/`, 영어는 `/en/...` (feature.md §12)
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];
