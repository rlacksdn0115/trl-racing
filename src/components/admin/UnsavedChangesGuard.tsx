'use client';

import { useEffect, useRef } from 'react';

const MESSAGE =
  '저장되지 않은 변경사항이 있습니다. 페이지를 이동하면 저장되지 않습니다. 이동하시겠습니까?';

function isModifiedField(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest('form.admin-form') != null;
}

function isModifiedFormSubmit(target: EventTarget | null): boolean {
  return target instanceof HTMLFormElement && target.classList.contains('admin-form');
}

export function UnsavedChangesGuard() {
  const isDirty = useRef(false);

  useEffect(() => {
    const markDirty = (event: Event) => {
      if (isModifiedField(event.target)) {
        isDirty.current = true;
      }
    };

    const clearDirtyOnSave = (event: Event) => {
      if (isModifiedFormSubmit(event.target)) {
        isDirty.current = false;
      }
    };

    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty.current) return;
      event.preventDefault();
      event.returnValue = MESSAGE;
    };

    const warnBeforeLinkNavigation = (event: MouseEvent) => {
      if (!isDirty.current || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as HTMLElement | null)?.closest('a[href]');
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== '_self') return;

      const nextUrl = new URL(link.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      if (nextUrl.href === currentUrl.href) return;

      if (!window.confirm(MESSAGE)) {
        event.preventDefault();
      } else {
        isDirty.current = false;
      }
    };

    document.addEventListener('input', markDirty, true);
    document.addEventListener('change', markDirty, true);
    document.addEventListener('submit', clearDirtyOnSave, true);
    document.addEventListener('click', warnBeforeLinkNavigation, true);
    window.addEventListener('beforeunload', warnBeforeUnload);

    return () => {
      document.removeEventListener('input', markDirty, true);
      document.removeEventListener('change', markDirty, true);
      document.removeEventListener('submit', clearDirtyOnSave, true);
      document.removeEventListener('click', warnBeforeLinkNavigation, true);
      window.removeEventListener('beforeunload', warnBeforeUnload);
    };
  }, []);

  return null;
}
