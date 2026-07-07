import styles from './PageHero.module.css';

/** 서브 페이지 상단 헤더 — Hero보다 약한 강도 (design.md §3.4) */
export function PageHero({
  label,
  title,
  desc,
}: {
  label: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className={styles.hero}>
      <div className="container">
        <p className={styles.label}>{label}</p>
        <h1 className={styles.title}>{title}</h1>
        {desc && <p className={styles.desc}>{desc}</p>}
      </div>
    </div>
  );
}
