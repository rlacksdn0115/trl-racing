import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getAdjacentNews, getNewsBySlug, getRaceById } from '@/lib/queries';
import { formatDate, localized } from '@/lib/utils';
import { RaceScheduleCard } from '@/components/RaceScheduleCard/RaceScheduleCard';
import styles from './page.module.css';

export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = await getNewsBySlug(slug);
  if (!post) return { title: 'TRL Racing' };
  const title = locale === 'en' ? post.title_en : post.title_ko;
  return { title: `${title} — TRL Racing` };
}

export default async function NewsDetailPage({
  params: { slug },
}: {
  params: { locale: string; slug: string };
}) {
  const post = await getNewsBySlug(slug);
  if (!post) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('news');
  const [adjacent, relatedRace] = await Promise.all([
    getAdjacentNews(post),
    post.related_race_id ? getRaceById(post.related_race_id) : Promise.resolve(null),
  ]);

  const body = localized(post, 'body', locale);

  return (
    <>
      {/* Article Header (design.md §15) */}
      <header className={styles.header}>
        <div className="container-narrow">
          <p className={styles.meta}>
            <span className={styles.category}>
              {t(`category.${post.category}` as 'category.notice')}
            </span>
            <span className={styles.date}>{formatDate(post.published_at)}</span>
            {post.author && <span className={styles.author}>{post.author}</span>}
          </p>
          <h1 className={styles.title}>{localized(post, 'title', locale)}</h1>
        </div>
      </header>

      <article className={`section ${styles.article}`}>
        <div className="container-narrow">
          {post.cover_image_url && (
            <div className={styles.cover}>
              <Image
                src={post.cover_image_url}
                alt=""
                width={1200}
                height={675}
                priority
                className={styles.coverImage}
              />
            </div>
          )}

          {/* 본문 최대 너비 760px — container-narrow (design.md §15) */}
          <div className={styles.body}>{body}</div>

          {relatedRace && (
            <div className={styles.related}>
              <h2 className={styles.relatedTitle}>{t('relatedRace')}</h2>
              <RaceScheduleCard race={relatedRace} />
            </div>
          )}
        </div>
      </article>

      <nav className={styles.pager} aria-label="News navigation">
        <div className={`container-narrow ${styles.pagerInner}`}>
          {adjacent.prev ? (
            <Link href={`/news/${adjacent.prev.slug}`} className={styles.pagerLink}>
              <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
              <span>
                <span className={styles.pagerLabel}>{t('prevPost')}</span>
                {localized(adjacent.prev, 'title', locale)}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {adjacent.next ? (
            <Link
              href={`/news/${adjacent.next.slug}`}
              className={`${styles.pagerLink} ${styles.pagerNext}`}
            >
              <span>
                <span className={styles.pagerLabel}>{t('nextPost')}</span>
                {localized(adjacent.next, 'title', locale)}
              </span>
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>
    </>
  );
}
