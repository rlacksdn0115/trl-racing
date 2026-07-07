import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getRaces } from '@/lib/queries';
import { PageHero } from '@/components/PageHero/PageHero';
import { RaceResultTable } from '@/components/RaceResultTable/RaceResultTable';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: `${t('results')} — TRL Racing` };
}

export default async function ResultsPage() {
  const t = await getTranslations('results');
  const completed = await getRaces(['completed']);

  return (
    <>
      <PageHero label="RESULTS" title={t('title')} desc={t('desc')} />

      <section className="section">
        <div className="container">
          <RaceResultTable races={completed} />
        </div>
      </section>
    </>
  );
}
