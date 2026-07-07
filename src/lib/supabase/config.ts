export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Supabase 환경 변수가 없으면 사이트는 lib/queries/fallback-data.ts 의
 * 시드 데이터로 렌더링된다 (로컬 미리보기용). CMS는 사용 불가.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
