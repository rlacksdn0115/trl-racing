export type RaceStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';
export type MemberRole = 'driver' | 'leader';

export type NewsCategory = 'notice' | 'race' | 'result' | 'activity' | 'member';

export interface Member {
  id: string;
  slug: string;
  racing_number: string;
  name: string;
  field: string;
  role: MemberRole;
  favorite_car: string | null;
  favorite_track: string | null;
  birth_year: number | null;
  wheel_base: string | null;
  pedal: string | null;
  instagram: string | null;
  bio_ko: string | null;
  bio_en: string | null;
  profile_image_url: string | null;
  helmet_image_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface Car {
  id: string;
  name: string;
  manufacturer: string | null;
  car_class: string | null;
  description_ko: string | null;
  description_en: string | null;
  image_url: string | null;
  is_published: boolean;
}

export interface RaceResult {
  race_id: string;
  overall_pos: number | null;
  class_pos: number | null;
  qualifying_pos: number | null;
  fastest_lap: string | null;
  incidents: number | null;
  finish_status: string | null;
  notes_ko: string | null;
  notes_en: string | null;
}

export interface Race {
  id: string;
  slug: string;
  title_ko: string;
  title_en: string;
  status: RaceStatus;
  starts_at: string; // timestamptz ISO
  platform: string | null;
  series: string | null;
  circuit_name: string | null;
  circuit_info_ko: string | null;
  circuit_info_en: string | null;
  track_map_url: string | null;
  race_length: string | null;
  car_class: string | null;
  thumbnail_url: string | null;
  youtube_url: string | null;
  description_ko: string | null;
  description_en: string | null;
  review_ko: string | null;
  review_en: string | null;
  is_published: boolean;
  /* 조인 결과 */
  result: RaceResult | null;
  members: Member[];
  cars: Car[];
}

export interface NewsPost {
  id: string;
  slug: string;
  title_ko: string;
  title_en: string;
  category: NewsCategory;
  summary_ko: string | null;
  summary_en: string | null;
  body_ko: string | null;
  body_en: string | null;
  cover_image_url: string | null;
  author: string | null;
  published_at: string;
  related_race_id: string | null;
  is_published: boolean;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption_ko: string | null;
  caption_en: string | null;
  shot_at: string | null;
  related_race_id: string | null;
  is_published: boolean;
  sort_order: number;
}

/** settings 테이블(key/value)에서 조립되는 사이트 설정 */
export interface SiteSettings {
  hero_video_url: string;
  recruiting: boolean;
  discord_url: string;
  instagram_url: string;
  youtube_url: string;
  contact_url: string;
  partners?: Record<string, string>;
}

/** 스폰서 소개 · 모집 기본 설정 */
export const PARTNER_DEFAULTS: Record<string, string> = {
  partners_visible: 'true',
  partner_recruiting: 'true',
  partner_heading_ko: 'TRL Racing의 파트너가 되어주세요',
  partner_heading_en: 'Become a partner of TRL Racing',
  partner_intro_ko:
    'iRacing 엔듀런스 무대에서 함께 달릴 파트너를 찾습니다. 리버리와 방송, SNS로 파트너를 소개합니다.',
  partner_intro_en:
    'Join us on the iRacing endurance stage through liveries, broadcasts and social media.',
  partner_contact_url: '',
  partner_entries: '',
  partner_podiums: '',
  partner_finish_rate: '',
};

export type PartnerEntry = Record<string, string> & {
  id: string;
};

/** settings 테이블의 스폰서 데이터를 목록으로 변환 */
export function readPartners(
  settings: Record<string, string>,
): PartnerEntry[] {
  const entries: PartnerEntry[] = [];

  for (const [key, value] of Object.entries(settings)) {
    if (!/^partner_record_[a-zA-Z0-9-]+$/.test(key)) continue;

    try {
      const data = JSON.parse(value);

      if (
        !data ||
        typeof data !== 'object' ||
        typeof data.name !== 'string'
      ) {
        continue;
      }

      const fields = Object.fromEntries(
        Object.entries(data).filter(
          ([, fieldValue]) => typeof fieldValue === 'string',
        ),
      ) as Record<string, string>;

      entries.push({ ...fields, id: key });
    } catch {
      // 잘못된 데이터 하나 때문에 전체 페이지가 멈추지 않도록 처리
    }
  }

  // 이전 고정 슬롯 방식으로 저장된 데이터도 읽기
  for (const slot of [1, 2, 3]) {
    const prefix = `partner_${slot}_`;

    if (!settings[`${prefix}name`]?.trim()) continue;

    const fields = Object.fromEntries(
      Object.entries(settings)
        .filter(([key]) => key.startsWith(prefix))
        .map(([key, value]) => [key.slice(prefix.length), value]),
    );

    entries.push({ ...fields, id: `legacy-${slot}` });
  }

  return entries.sort(
    (a, b) =>
      (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0) ||
      a.id.localeCompare(b.id),
  );
}
