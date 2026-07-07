/**
 * CMS 전용 조회 — 공개 쿼리와 달리 is_published 필터 없이 전체를 본다.
 * (RLS: authenticated 는 미공개 행도 select 가능)
 */
import { createClient } from '@/lib/supabase/server';
import type { Car, GalleryImage, Member, NewsPost, Race } from '@/types/content';

export async function adminMembers(): Promise<Member[]> {
  const { data } = await createClient().from('members').select('*').order('sort_order');
  return data ?? [];
}

export async function adminMember(id: string): Promise<Member | null> {
  const { data } = await createClient().from('members').select('*').eq('id', id).maybeSingle();
  return data;
}

export async function adminCars(): Promise<Car[]> {
  const { data } = await createClient().from('cars').select('*').order('name');
  return data ?? [];
}

export async function adminCar(id: string): Promise<Car | null> {
  const { data } = await createClient().from('cars').select('*').eq('id', id).maybeSingle();
  return data;
}

export type AdminRace = Race & {
  race_members?: { member_id: string }[];
  race_cars?: { car_id: string }[];
};

export async function adminRaces(): Promise<AdminRace[]> {
  const { data } = await createClient()
    .from('races')
    .select('*, race_results(*), race_members(member_id), race_cars(car_id)')
    .order('starts_at', { ascending: false });
  return (data ?? []).map((row: any) => ({
    ...row,
    result: Array.isArray(row.race_results) ? (row.race_results[0] ?? null) : row.race_results,
  }));
}

export async function adminRace(id: string): Promise<AdminRace | null> {
  const { data } = await createClient()
    .from('races')
    .select('*, race_results(*), race_members(member_id), race_cars(car_id)')
    .eq('id', id)
    .maybeSingle();
  if (!data) return null;
  const row: any = data;
  return {
    ...row,
    result: Array.isArray(row.race_results) ? (row.race_results[0] ?? null) : row.race_results,
  };
}

export async function adminNewsList(): Promise<NewsPost[]> {
  const { data } = await createClient()
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });
  return data ?? [];
}

export async function adminNewsPost(id: string): Promise<NewsPost | null> {
  const { data } = await createClient().from('news').select('*').eq('id', id).maybeSingle();
  return data;
}

export async function adminGallery(): Promise<GalleryImage[]> {
  const { data } = await createClient()
    .from('gallery')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function adminGalleryImage(id: string): Promise<GalleryImage | null> {
  const { data } = await createClient().from('gallery').select('*').eq('id', id).maybeSingle();
  return data;
}

export async function adminSettingsMap(): Promise<Record<string, string>> {
  const { data } = await createClient().from('settings').select('key, value');
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? '']));
}

export async function adminCounts() {
  const supabase = createClient();
  const count = async (table: string, filter?: (q: any) => any) => {
    let q: any = supabase.from(table).select('*', { count: 'exact', head: true });
    if (filter) q = filter(q);
    const { count: n } = await q;
    return n ?? 0;
  };
  const [members, upcoming, completed, news, gallery] = await Promise.all([
    count('members'),
    count('races', (q) => q.in('status', ['upcoming', 'live'])),
    count('races', (q) => q.eq('status', 'completed')),
    count('news'),
    count('gallery'),
  ]);
  return { members, upcoming, completed, news, gallery };
}
