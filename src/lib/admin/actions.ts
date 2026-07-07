'use server';

/**
 * CMS 서버 액션. 인증은 requireUser()로 확인하고,
 * 실제 데이터 보호는 Supabase RLS(authenticated write)가 담당한다.
 * 실패 시 목록 페이지로 ?error= 리다이렉트, 성공 시 ?saved=1.
 */
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { bool, dateStr, kstDateTimeToIso, num, str } from './form';

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  return supabase;
}

function done(listPath: string, error?: string): never {
  revalidatePath('/', 'layout');
  redirect(error ? `${listPath}?error=${encodeURIComponent(error)}` : `${listPath}?saved=1`);
}

/* ---------- Auth ---------- */

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

/* ---------- Members ---------- */

export async function saveMember(fd: FormData) {
  const supabase = await requireUser();
  const id = str(fd, 'id');
  const payload = {
    slug: str(fd, 'slug'),
    racing_number: str(fd, 'racing_number'),
    name: str(fd, 'name'),
    field: str(fd, 'field') ?? '',
    role: str(fd, 'role') ?? 'driver',
    favorite_car: str(fd, 'favorite_car'),
    favorite_track: str(fd, 'favorite_track'),
    birth_year: num(fd, 'birth_year'),
    wheel_base: str(fd, 'wheel_base'),
    pedal: str(fd, 'pedal'),
    instagram: str(fd, 'instagram'),
    bio_ko: str(fd, 'bio_ko'),
    bio_en: str(fd, 'bio_en'),
    profile_image_url: str(fd, 'profile_image_url'),
    helmet_image_url: str(fd, 'helmet_image_url'),
    is_published: bool(fd, 'is_published'),
    sort_order: num(fd, 'sort_order') ?? 0,
  };
  if (!payload.slug || !payload.name || !payload.racing_number) {
    done('/admin/members', 'slug, 이름, 레이싱 번호는 필수입니다.');
  }
  const { error } = id
    ? await supabase.from('members').update(payload).eq('id', id)
    : await supabase.from('members').insert(payload);
  done('/admin/members', error?.message);
}

export async function deleteMember(fd: FormData) {
  const supabase = await requireUser();
  const id = str(fd, 'id');
  const { error } = await supabase.from('members').delete().eq('id', id);
  done('/admin/members', error?.message);
}

/* ---------- Cars ---------- */

export async function saveCar(fd: FormData) {
  const supabase = await requireUser();
  const id = str(fd, 'id');
  const payload = {
    name: str(fd, 'name'),
    manufacturer: str(fd, 'manufacturer'),
    car_class: str(fd, 'car_class'),
    description_ko: str(fd, 'description_ko'),
    description_en: str(fd, 'description_en'),
    image_url: str(fd, 'image_url'),
    is_published: bool(fd, 'is_published'),
  };
  if (!payload.name) done('/admin/cars', '차량명은 필수입니다.');
  const { error } = id
    ? await supabase.from('cars').update(payload).eq('id', id)
    : await supabase.from('cars').insert(payload);
  done('/admin/cars', error?.message);
}

export async function deleteCar(fd: FormData) {
  const supabase = await requireUser();
  const { error } = await supabase.from('cars').delete().eq('id', str(fd, 'id'));
  done('/admin/cars', error?.message);
}

/* ---------- Races ---------- */

export async function saveRace(fd: FormData) {
  const supabase = await requireUser();
  const id = str(fd, 'id');
  const title = str(fd, 'title_en');
  const payload = {
    slug: str(fd, 'slug'),
    title_ko: title,
    title_en: title,
    status: str(fd, 'status') ?? 'upcoming',
    starts_at: kstDateTimeToIso(fd, 'starts_at_date', 'starts_at_time'),
    platform: str(fd, 'platform'),
    series: str(fd, 'series'),
    circuit_name: str(fd, 'circuit_name'),
    circuit_info_ko: str(fd, 'circuit_info_ko'),
    circuit_info_en: str(fd, 'circuit_info_en'),
    track_map_url: str(fd, 'track_map_url'),
    race_length: str(fd, 'race_length'),
    car_class: str(fd, 'car_class'),
    thumbnail_url: str(fd, 'thumbnail_url'),
    youtube_url: str(fd, 'youtube_url'),
    description_ko: str(fd, 'description_ko'),
    description_en: str(fd, 'description_en'),
    review_ko: str(fd, 'review_ko'),
    review_en: str(fd, 'review_en'),
    is_published: bool(fd, 'is_published'),
  };
  if (!payload.slug || !payload.title_en || !payload.starts_at) {
    done('/admin/races', 'slug, 경기명, 시작 날짜는 필수입니다.');
  }

  let raceId = id;
  if (id) {
    const { error } = await supabase.from('races').update(payload).eq('id', id);
    if (error) done('/admin/races', error.message);
  } else {
    const { data, error } = await supabase
      .from('races')
      .insert(payload)
      .select('id')
      .single();
    if (error || !data) done('/admin/races', error?.message ?? '경기 생성 실패');
    raceId = data.id;
  }

  /* 출전 멤버/차량 연결 갱신 (전체 교체) */
  const memberIds = fd.getAll('member_ids').map(String).filter(Boolean);
  const carIds = fd.getAll('car_ids').map(String).filter(Boolean);
  await supabase.from('race_members').delete().eq('race_id', raceId);
  if (memberIds.length > 0) {
    await supabase
      .from('race_members')
      .insert(memberIds.map((member_id) => ({ race_id: raceId, member_id })));
  }
  await supabase.from('race_cars').delete().eq('race_id', raceId);
  if (carIds.length > 0) {
    await supabase
      .from('race_cars')
      .insert(carIds.map((car_id) => ({ race_id: raceId, car_id })));
  }

  /* 결과 — 입력값이 하나라도 있으면 upsert, 전부 비면 삭제 */
  const result = {
    race_id: raceId,
    overall_pos: num(fd, 'overall_pos'),
    class_pos: num(fd, 'class_pos'),
    qualifying_pos: num(fd, 'qualifying_pos'),
    fastest_lap: str(fd, 'fastest_lap'),
    incidents: num(fd, 'incidents'),
    finish_status: bool(fd, 'result_dnf') ? 'DNF' : str(fd, 'finish_status'),
    notes_ko: str(fd, 'notes_ko'),
    notes_en: str(fd, 'notes_en'),
  };
  const hasResult = Object.entries(result).some(
    ([key, value]) => key !== 'race_id' && value != null,
  );
  if (hasResult) {
    const { error } = await supabase.from('race_results').upsert(result);
    if (error) done('/admin/races', error.message);
  } else {
    await supabase.from('race_results').delete().eq('race_id', raceId);
  }

  done('/admin/races');
}

export async function deleteRace(fd: FormData) {
  const supabase = await requireUser();
  const { error } = await supabase.from('races').delete().eq('id', str(fd, 'id'));
  done('/admin/races', error?.message);
}

/* ---------- News ---------- */

export async function saveNews(fd: FormData) {
  const supabase = await requireUser();
  const id = str(fd, 'id');
  const payload = {
    slug: str(fd, 'slug'),
    title_ko: str(fd, 'title_ko'),
    title_en: str(fd, 'title_en'),
    category: str(fd, 'category') ?? 'notice',
    summary_ko: str(fd, 'summary_ko'),
    summary_en: str(fd, 'summary_en'),
    body_ko: str(fd, 'body_ko'),
    body_en: str(fd, 'body_en'),
    cover_image_url: str(fd, 'cover_image_url'),
    author: str(fd, 'author'),
    related_race_id: str(fd, 'related_race_id'),
    is_published: bool(fd, 'is_published'),
    ...(!id ? { published_at: new Date().toISOString() } : {}),
  };
  if (!payload.slug || !payload.title_ko || !payload.title_en) {
    done('/admin/news', 'slug, 제목(KO/EN)은 필수입니다.');
  }
  const { error } = id
    ? await supabase.from('news').update(payload).eq('id', id)
    : await supabase.from('news').insert(payload);
  done('/admin/news', error?.message);
}

export async function deleteNews(fd: FormData) {
  const supabase = await requireUser();
  const { error } = await supabase.from('news').delete().eq('id', str(fd, 'id'));
  done('/admin/news', error?.message);
}

/* ---------- Gallery ---------- */

export async function saveGalleryImage(fd: FormData) {
  const supabase = await requireUser();
  const id = str(fd, 'id');
  const payload = {
    image_url: str(fd, 'image_url'),
    caption_ko: str(fd, 'caption_ko'),
    caption_en: str(fd, 'caption_en'),
    shot_at: dateStr(fd, 'shot_at'),
    related_race_id: str(fd, 'related_race_id'),
    is_published: bool(fd, 'is_published'),
    sort_order: num(fd, 'sort_order') ?? 0,
  };
  if (!payload.image_url) done('/admin/gallery', '이미지는 필수입니다.');
  const { error } = id
    ? await supabase.from('gallery').update(payload).eq('id', id)
    : await supabase.from('gallery').insert(payload);
  done('/admin/gallery', error?.message);
}

export async function deleteGalleryImage(fd: FormData) {
  const supabase = await requireUser();
  const { error } = await supabase.from('gallery').delete().eq('id', str(fd, 'id'));
  done('/admin/gallery', error?.message);
}

/* ---------- Settings ---------- */

const SETTING_KEYS = [
  'hero_video_url',
  'recruiting',
  'discord_url',
  'instagram_url',
  'youtube_url',
  'contact_url',
] as const;

export async function saveSettings(fd: FormData) {
  const supabase = await requireUser();
  const rows = SETTING_KEYS.map((key) => ({
    key,
    value: key === 'recruiting' ? String(bool(fd, key)) : (str(fd, key) ?? ''),
  }));
  const { error } = await supabase.from('settings').upsert(rows);
  done('/admin/settings', error?.message);
}
