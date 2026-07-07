import styles from './SectionHeading.module.css';

/** 공통 섹션 헤더 (design.md §11) — 번호/라벨 + 큰 제목 + 짧은 설명, 좌측 정렬 */
export function SectionHeading({
  no,
  label,
  title,
  desc,
}: {
  no?: string;
  label: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className={`${styles.heading} reveal`}>
      <p className={styles.label}>
        {no && <span className={styles.no}>{no} / </span>}
        {label}
      </p>
      <h2 className={styles.title}>{title}</h2>
      {desc && <p className={styles.desc}>{desc}</p>}
    </div>
  );
}
