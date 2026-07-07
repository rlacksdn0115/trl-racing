import type { Locale } from '@/i18n/routing';

/** `_ko` / `_en` 병기 컬럼에서 현재 locale 값을 고른다. 비어 있으면 반대 언어로 폴백. */
export function localized<T extends object>(
  item: T,
  base: string,
  locale: Locale,
): string {
  const record = item as Record<string, unknown>;
  const primary = record[`${base}_${locale}`];
  const fallback = record[`${base}_${locale === 'ko' ? 'en' : 'ko'}`];
  const value = (primary as string | null) || (fallback as string | null) || '';
  return value.trim();
}

/** 2026.03.27 — Mono 폰트용 날짜 포맷 (양 언어 공통) */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

/** 2026.03.27 21:00 (KST 기준 표기) */
export function formatDateTime(iso: string, locale: Locale): string {
  const d = new Date(iso);
  const time = new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  }).format(d);
  return `${formatDate(iso)} ${time} KST`;
}

/** YouTube URL → embed URL (watch/shortened/embed 모두 허용) */
export function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    let id = '';
    if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
    else if (u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2];
    else if (u.pathname.startsWith('/live/')) id = u.pathname.split('/')[2];
    else id = u.searchParams.get('v') ?? '';
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export function parseUrlList(value: string | null | undefined): string[] {
  return (value ?? '')
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);
}

/** P1 / P26 표기 (design.md §14) */
export function formatPosition(pos: number | null): string {
  return pos == null ? '—' : `P${pos}`;
}

export function isDnf(finishStatus: string | null | undefined): boolean {
  return finishStatus?.trim().toUpperCase() === 'DNF';
}

export function formatResultPosition(
  pos: number | null,
  finishStatus: string | null | undefined,
): string {
  return isDnf(finishStatus) ? 'DNF' : formatPosition(pos);
}

export function formatRacePlatform(platform: string | null | undefined): string {
  if (!platform) return '';
  if (platform === 'iracing') return 'iRacing';
  if (platform === 'assetto_corsa') return 'Assetto Corsa';
  return platform;
}
