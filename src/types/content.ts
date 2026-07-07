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
}
