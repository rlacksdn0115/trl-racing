/**
 * 공개 페이지용 데이터 조회 계층.
 * - Supabase env 미설정: fallback-data(시드 미러)로 렌더링
 * - 쿼리 오류: 오류 로그 후 fallback 반환 (사이트 다운 방지)
 */
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type {
  GalleryImage,
  Member,
  NewsPost,
  Race,
  SiteSettings,
} from '@/types/content';
import * as fallback from './fallback-data';

const RACE_SELECT =
  '*, race_results(*), race_members(members(*)), race_cars(cars(*))';

/* Supabase 조인 행 → Race 평탄화 */
function mapRace(row: any): Race {
  const members = (row.race_members ?? [])
    .map((rm: { members: Member | null }) => rm.members)
    .filter(Boolean)
    .sort((a: Member, b: Member) => a.sort_order - b.sort_order);
  const cars = (row.race_cars ?? [])
    .map((rc: any) => rc.cars)
    .filter(Boolean);
  const result = Array.isArray(row.race_results)
    ? (row.race_results[0] ?? null)
    : (row.race_results ?? null);
  const { race_members: _rm, race_cars: _rc, race_results: _rr, ...race } = row;
  return { ...race, members, cars, result } as Race;
}

function warn(scope: string, error: unknown) {
  console.error(`[queries:${scope}]`, error);
}

/* ---------- Members ---------- */

export async function getMembers(): Promise<Member[]> {
  if (!isSupabaseConfigured) return fallback.members;
  const { data, error } = await createClient()
    .from('members')
    .select('*')
    .eq('is_published', true)
    .order('sort_order');
  if (error) {
    warn('getMembers', error);
    return fallback.members;
  }
  return data ?? [];
}

export async function getMemberBySlug(slug: string): Promise<Member | null> {
  if (!isSupabaseConfigured)
    return fallback.members.find((m) => m.slug === slug) ?? null;
  const { data, error } = await createClient()
    .from('members')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  if (error) {
    warn('getMemberBySlug', error);
    return fallback.members.find((m) => m.slug === slug) ?? null;
  }
  return data;
}

export async function getRacesByMember(memberId: string): Promise<Race[]> {
  if (!isSupabaseConfigured)
    return fallback.races.filter((r) => r.members.some((m) => m.id === memberId));
  const { data, error } = await createClient()
    .from('races')
    .select('*, race_results(*), race_members!inner(member_id, members(*)), race_cars(cars(*))')
    .eq('race_members.member_id', memberId)
    .eq('is_published', true)
    .order('starts_at', { ascending: false });
  if (error) {
    warn('getRacesByMember', error);
    return [];
  }
  return (data ?? []).map(mapRace);
}

/* ---------- Races ---------- */

export async function getRaces(statuses?: Race['status'][]): Promise<Race[]> {
  if (!isSupabaseConfigured) {
    const list = statuses
      ? fallback.races.filter((r) => statuses.includes(r.status))
      : fallback.races;
    return [...list].sort(
      (a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime(),
    );
  }
  let query = createClient()
    .from('races')
    .select(RACE_SELECT)
    .eq('is_published', true)
    .order('starts_at', { ascending: false });
  if (statuses) query = query.in('status', statuses);
  const { data, error } = await query;
  if (error) {
    warn('getRaces', error);
    return statuses
      ? fallback.races.filter((r) => statuses.includes(r.status))
      : fallback.races;
  }
  return (data ?? []).map(mapRace);
}

/** 다음 경기 — live 우선, 없으면 가장 가까운 upcoming */
export async function getNextRace(): Promise<Race | null> {
  const candidates = await getRaces(['live', 'upcoming']);
  if (candidates.length === 0) return null;
  const live = candidates.find((r) => r.status === 'live');
  if (live) return live;
  // upcoming 중 가장 이른 경기
  return [...candidates].sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
  )[0];
}

export async function getRaceBySlug(slug: string): Promise<Race | null> {
  if (!isSupabaseConfigured)
    return fallback.races.find((r) => r.slug === slug) ?? null;
  const { data, error } = await createClient()
    .from('races')
    .select(RACE_SELECT)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  if (error) {
    warn('getRaceBySlug', error);
    return fallback.races.find((r) => r.slug === slug) ?? null;
  }
  return data ? mapRace(data) : null;
}

/** 경기 상세의 이전/다음 경기 (starts_at 기준) */
export async function getAdjacentRaces(
  race: Race,
): Promise<{ prev: Race | null; next: Race | null }> {
  const all = await getRaces();
  const sorted = [...all].sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
  );
  const idx = sorted.findIndex((r) => r.id === race.id);
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}

export async function getRecentResults(limit = 4): Promise<Race[]> {
  const completed = await getRaces(['completed']);
  return completed.filter((r) => r.result).slice(0, limit);
}

/* ---------- News ---------- */

export async function getNewsList(category?: string): Promise<NewsPost[]> {
  if (!isSupabaseConfigured) {
    const list = category
      ? fallback.news.filter((n) => n.category === category)
      : fallback.news;
    return [...list].sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    );
  }
  let query = createClient()
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) {
    warn('getNewsList', error);
    return fallback.news;
  }
  return data ?? [];
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  if (!isSupabaseConfigured)
    return fallback.news.find((n) => n.slug === slug) ?? null;
  const { data, error } = await createClient()
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  if (error) {
    warn('getNewsBySlug', error);
    return fallback.news.find((n) => n.slug === slug) ?? null;
  }
  return data;
}

export async function getAdjacentNews(
  post: NewsPost,
): Promise<{ prev: NewsPost | null; next: NewsPost | null }> {
  const all = await getNewsList();
  const sorted = [...all].sort(
    (a, b) =>
      new Date(a.published_at).getTime() - new Date(b.published_at).getTime(),
  );
  const idx = sorted.findIndex((n) => n.id === post.id);
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}

export async function getNewsByRace(raceId: string): Promise<NewsPost[]> {
  const all = await getNewsList();
  return all.filter((n) => n.related_race_id === raceId);
}

export async function getRaceById(id: string): Promise<Race | null> {
  const all = await getRaces();
  return all.find((r) => r.id === id) ?? null;
}

/* ---------- Gallery ---------- */

export async function getGalleryImages(options?: {
  limit?: number;
  raceId?: string;
}): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured) {
    let list = fallback.gallery;
    if (options?.raceId) list = list.filter((g) => g.related_race_id === options.raceId);
    return options?.limit ? list.slice(0, options.limit) : list;
  }
  let query = createClient()
    .from('gallery')
    .select('*')
    .eq('is_published', true)
    .order('sort_order')
    .order('created_at', { ascending: false });
  if (options?.raceId) query = query.eq('related_race_id', options.raceId);
  if (options?.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  if (error) {
    warn('getGalleryImages', error);
    return fallback.gallery;
  }
  return data ?? [];
}

/* ---------- Settings ---------- */

export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return fallback.settings;
  const { data, error } = await createClient().from('settings').select('key, value');
  if (error) {
    warn('getSettings', error);
    return fallback.settings;
  }
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? '']));
  return {
    hero_video_url: map.hero_video_url ?? '',
    recruiting: map.recruiting !== 'false',
    discord_url: map.discord_url ?? '',
    instagram_url: map.instagram_url ?? '',
    youtube_url: map.youtube_url ?? '',
    contact_url: map.contact_url ?? '',
  };
}
