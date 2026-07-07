'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * `.reveal` 요소에 스크롤 진입 시 `.is-visible` 을 붙인다 (design.md §21 Section reveal).
 * reduced-motion은 globals.css에서 처리(항상 표시).
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal:not(.is-visible)');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
