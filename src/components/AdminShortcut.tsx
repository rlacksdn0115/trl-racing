'use client';

import { useEffect } from 'react';

/**
 * 관리자 페이지 진입 단축키 (feature.md §16)
 * Mac: Cmd+Shift+A / Windows: Ctrl+Shift+A
 * 보안 수단이 아니라 편의 기능 — 접근 제어는 Supabase Auth가 담당.
 */
export function AdminShortcut() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.location.href = '/admin';
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return null;
}
