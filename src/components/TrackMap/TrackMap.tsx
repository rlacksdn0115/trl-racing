/* eslint-disable @next/next/no-img-element */
import styles from './TrackMap.module.css';

/**
 * 서킷 맵 (design.md §8.2).
 * track_map_url 이 있으면 이미지를, 없으면 장식용 제네릭 라인을 표시한다.
 * (실제 트랙 형태 이미지는 CMS에서 업로드 — 임의 형태를 트랙처럼 그리지 않는다)
 */
export function TrackMap({
  src,
  name,
  active = false,
  decorative = false,
}: {
  src?: string | null;
  name?: string | null;
  active?: boolean;
  decorative?: boolean;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={decorative ? '' : (name ?? 'Track map')}
        className={`${styles.map} ${active ? styles.active : ''}`}
        loading="lazy"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      className={`${styles.map} ${styles.placeholder} ${active ? styles.active : ''}`}
      aria-hidden
    >
      <path
        d="M8 62 C 20 62 26 44 42 42 C 58 40 62 24 52 16 C 44 10 50 4 62 6 C 80 9 84 30 98 26 C 108 23 112 34 106 42 C 98 52 78 48 66 56 C 54 64 30 74 8 62 Z"
        stroke="currentcolor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
