'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toYouTubeEmbed } from '@/lib/utils';
import styles from './HeroSection.module.css';

type YouTubeStateEvent = { data: number };
type YouTubePlayer = { destroy: () => void };

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLIFrameElement,
        options: { events: { onStateChange: (event: YouTubeStateEvent) => void } },
      ) => YouTubePlayer;
      PlayerState: { ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  youtubeApiPromise ??= new Promise<void>((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}

/**
 * Hero 배경 영상 (feature.md §3 / plan.md D2 절충안)
 * - 음소거 자동재생, 컨트롤 없음
 * - 모바일(768px 미만)과 prefers-reduced-motion 에서는 렌더링하지 않음 → 정적 배경 유지
 * - YouTube URL 은 nocookie 임베드, 그 외 URL 은 <video> 로 처리
 * - 여러 URL 이 있으면 순서대로 반복 재생
 */
export function HeroVideo({ urls }: { urls: string[] }) {
  const [enabled, setEnabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const currentUrl = urls[currentIndex] ?? '';
  const hasMultiple = urls.length > 1;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 768px)');
    const update = () => setEnabled(!reduced.matches && desktop.matches);
    update();
    reduced.addEventListener('change', update);
    desktop.addEventListener('change', update);
    return () => {
      reduced.removeEventListener('change', update);
      desktop.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [urls]);

  const playNext = useCallback(() => {
    if (!hasMultiple) return;
    setCurrentIndex((index) => (index + 1) % urls.length);
  }, [hasMultiple, urls.length]);

  const embed = toYouTubeEmbed(currentUrl);

  useEffect(() => {
    if (!enabled || !embed || !iframeRef.current) return undefined;

    let player: YouTubePlayer | null = null;
    let disposed = false;

    loadYouTubeApi().then(() => {
      if (disposed || !iframeRef.current || !window.YT?.Player) return;
      player = new window.YT.Player(iframeRef.current, {
        events: {
          onStateChange(event) {
            if (event.data === window.YT?.PlayerState.ENDED) {
              playNext();
            }
          },
        },
      });
    });

    return () => {
      disposed = true;
      player?.destroy();
    };
  }, [currentUrl, embed, enabled, playNext]);

  if (!enabled) return null;

  if (embed) {
    const id = embed.split('/').pop();
    const loopParam = hasMultiple ? 'loop=0' : `loop=1&playlist=${id}`;
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      controls: '0',
      playsinline: '1',
      rel: '0',
      disablekb: '1',
      fs: '0',
      iv_load_policy: '3',
      modestbranding: '1',
      enablejsapi: '1',
    });
    const src = `${embed.replace('youtube.com', 'youtube-nocookie.com')}?${params.toString()}&${loopParam}`;
    return (
      <div className={styles.videoWrap} aria-hidden>
        <iframe
          key={currentUrl}
          ref={iframeRef}
          className={styles.videoFrame}
          src={src}
          title=""
          allow="autoplay; encrypted-media"
          tabIndex={-1}
        />
      </div>
    );
  }

  return (
    <div className={styles.videoWrap} aria-hidden>
      <video
        key={currentUrl}
        className={styles.videoEl}
        src={currentUrl}
        autoPlay
        muted
        loop={!hasMultiple}
        playsInline
        onEnded={playNext}
      />
    </div>
  );
}
