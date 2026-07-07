import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getGalleryImages } from '@/lib/queries';
import { PageHero } from '@/components/PageHero/PageHero';
import { GalleryGrid } from '@/components/GalleryGrid/GalleryGrid';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'gallery' });
  return { title: `${t('title')} — TRL Racing` };
}

export default async function GalleryPage() {
  const t = await getTranslations('gallery');
  const images = await getGalleryImages();

  return (
    <>
      <PageHero label="GALLERY" title={t('title')} desc={t('desc')} />

      <section className="section">
        <div className="container-wide">
          <GalleryGrid images={images} />
        </div>
      </section>
    </>
  );
}
