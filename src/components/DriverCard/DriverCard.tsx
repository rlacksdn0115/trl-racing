import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Member } from '@/types/content';
import styles from './DriverCard.module.css';

/** 멤버 카드 (design.md §12.1) — 번호 워터마크 + 헬멧 이미지, 팀 리더는 오렌지 상단 바 */
export function DriverCard({ member }: { member: Member }) {
  const t = useTranslations('member');
  const isLeader = member.role === 'leader';
  const image = member.profile_image_url ?? member.helmet_image_url;
  const meta = [member.field, t(`role.${member.role}`)].filter(Boolean).join(' · ');

  return (
    <Link
      href={`/members/${member.slug}`}
      className={`${styles.card} ${isLeader ? styles.leader : ''}`}
    >
      {isLeader && <span className={styles.leaderLabel}>{t('teamLeader')}</span>}
      <span className={styles.watermark} aria-hidden>
        {member.racing_number}
      </span>

      <div className={styles.imageWrap}>
        {image ? (
          <Image
            src={image}
            alt={`${member.name} helmet`}
            width={360}
            height={360}
            className={styles.image}
          />
        ) : (
          <span className={styles.imagePlaceholder} aria-hidden />
        )}
      </div>

      <div className={styles.meta}>
        <p className={styles.number}>NO. {member.racing_number}</p>
        <h3 className={styles.name}>{member.name}</h3>
        <p className={styles.field}>{meta}</p>
      </div>

      <dl className={styles.stats}>
        {member.favorite_car && (
          <div className={styles.stat}>
            <dt className={styles.statLabel}>{t('favoriteCar')}</dt>
            <dd className={styles.statValue}>{member.favorite_car}</dd>
          </div>
        )}
        {member.favorite_track && (
          <div className={styles.stat}>
            <dt className={styles.statLabel}>{t('favoriteTrack')}</dt>
            <dd className={styles.statValue}>{member.favorite_track}</dd>
          </div>
        )}
      </dl>
    </Link>
  );
}
