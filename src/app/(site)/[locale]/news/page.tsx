import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getNewsList } from '@/lib/queries';
import type { NewsCategory } from '@/types/content';
import { PageHero } from '@/components/PageHero/PageHero';
import { NewsCard } from '@/components/NewsCard/NewsCard';
import styles from './page.module.css';

const CATEGORIES: Array<NewsCategory | 'all'> = [
  'all',
  'notice',
  'race',
  'result',
  'activity',
  'member',
];

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'news' });
  return { title: `${t('title')} — TRL Racing` };
}

export default async function NewsPage({
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string };
}) {
  const t = await getTranslations('news');
  const active =
    searchParams.category && CATEGORIES.includes(searchParams.category as NewsCategory)
      ? (searchParams.category as NewsCategory)
      : 'all';
  const posts = await getNewsList(active === 'all' ? undefined : active);
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero label="NEWS" title={t('title')} desc={t('desc')} />

      <section className="section">
        <div className="container">
          {/* 카테고리 필터 (design.md §15) */}
          <nav className={styles.filters} aria-label="Category filter">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                href={category === 'all' ? '/news' : `/news?category=${category}`}
                className={`${styles.filter} ${active === category ? styles.filterActive : ''}`}
                aria-current={active === category ? 'true' : undefined}
              >
                {t(`category.${category}` as 'category.all')}
              </Link>
            ))}
          </nav>

          {posts.length === 0 ? (
            <p className={styles.empty}>{t('empty')}</p>
          ) : (
            <>
              <div className={styles.featured}>
                <NewsCard post={featured} featured />
              </div>
              {rest.length > 0 && (
                <div className={styles.grid}>
                  {rest.map((post) => (
                    <NewsCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
