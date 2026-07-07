import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { NewsPost } from '@/types/content';
import { formatDate, localized } from '@/lib/utils';
import styles from './NewsCard.module.css';

/** 뉴스 카드 (design.md §15) — featured 변형은 큰 이미지/타이포 */
export function NewsCard({
  post,
  featured = false,
}: {
  post: NewsPost;
  featured?: boolean;
}) {
  const t = useTranslations('news');
  const locale = useLocale() as Locale;
  const summary = localized(post, 'summary', locale) || localized(post, 'body', locale);

  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <Link href={`/news/${post.slug}`} className={styles.link}>
        {post.cover_image_url && (
          <div className={styles.imageWrap}>
            <Image
              src={post.cover_image_url}
              alt=""
              width={featured ? 960 : 480}
              height={featured ? 540 : 270}
              className={styles.image}
            />
          </div>
        )}
        <div className={styles.body}>
          <p className={styles.meta}>
            <span className={styles.date}>{formatDate(post.published_at)}</span>
            <span className={styles.category}>
              {t(`category.${post.category}` as 'category.notice')}
            </span>
          </p>
          <h3 className={styles.title}>{localized(post, 'title', locale)}</h3>
          {summary && <p className={styles.summary}>{summary}</p>}
        </div>
      </Link>
    </article>
  );
}
