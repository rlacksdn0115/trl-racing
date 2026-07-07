'use client';

/* eslint-disable @next/next/no-img-element */
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import type { GalleryImage } from '@/types/content';
import { localized } from '@/lib/utils';
import styles from './GalleryGrid.module.css';

/**
 * 갤러리 (design.md §16) — 비대칭 그리드 + Lightbox(키보드 탐색 지원)
 */
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const t = useTranslations('gallery');
  const locale = useLocale() as Locale;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) =>
        current == null ? null : (current + delta + images.length) % images.length,
      );
    },
    [images.length],
  );

  useEffect(() => {
    if (openIndex == null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, close, step]);

  if (images.length === 0) {
    return <p className={styles.empty}>{t('empty')}</p>;
  }

  const current = openIndex != null ? images[openIndex] : null;

  return (
    <>
      <ul className={styles.grid}>
        {images.map((image, i) => {
          const caption = localized(image, 'caption', locale);
          return (
            <li key={image.id} className={styles.item}>
              <button
                type="button"
                className={styles.thumbButton}
                onClick={() => setOpenIndex(i)}
                aria-label={caption || `Image ${i + 1}`}
              >
                <img
                  src={image.image_url}
                  alt={caption}
                  loading="lazy"
                  className={styles.thumb}
                />
                {caption && <span className={styles.caption}>{caption}</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {current && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={localized(current, 'caption', locale) || 'Image viewer'}
          onClick={close}
        >
          <div className={styles.lightboxInner} onClick={(e) => e.stopPropagation()}>
            <img
              src={current.image_url}
              alt={localized(current, 'caption', locale)}
              className={styles.lightboxImage}
            />
            {localized(current, 'caption', locale) && (
              <p className={styles.lightboxCaption}>
                {localized(current, 'caption', locale)}
              </p>
            )}
          </div>

          <button
            type="button"
            className={`${styles.control} ${styles.closeButton}`}
            onClick={close}
            aria-label={t('lightboxClose')}
          >
            <X size={22} strokeWidth={1.75} />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.control} ${styles.prevButton}`}
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={t('lightboxPrev')}
              >
                <ChevronLeft size={26} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className={`${styles.control} ${styles.nextButton}`}
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label={t('lightboxNext')}
              >
                <ChevronRight size={26} strokeWidth={1.75} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
