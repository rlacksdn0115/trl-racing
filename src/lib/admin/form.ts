/** CMS 폼 FormData 파싱 헬퍼 */

export function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  const s = typeof v === 'string' ? v.trim() : '';
  return s || null;
}

export function num(fd: FormData, key: string): number | null {
  const s = str(fd, key);
  if (s == null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === 'on';
}

/** datetime-local 입력값(KST 기준) → timestamptz ISO */
export function kstToIso(fd: FormData, key: string): string | null {
  const s = str(fd, key);
  if (!s) return null;
  return `${s}:00+09:00`;
}

/** date + optional time 입력값(KST 기준) → timestamptz ISO */
export function kstDateTimeToIso(
  fd: FormData,
  dateKey: string,
  timeKey: string,
): string | null {
  const date = str(fd, dateKey);
  if (!date) return null;
  const time = str(fd, timeKey) ?? '00:00';
  return `${date}T${time}:00+09:00`;
}

/** timestamptz ISO → datetime-local 입력값 (KST 표시) */
export function isoToKstInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  const kst = new Date(d.getTime() + 9 * 3600_000);
  return kst.toISOString().slice(0, 16);
}

/** timestamptz ISO → date 입력값 (KST 표시) */
export function isoToKstDateInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  const kst = new Date(d.getTime() + 9 * 3600_000);
  return kst.toISOString().slice(0, 10);
}

/** timestamptz ISO → time 입력값 (KST 표시) */
export function isoToKstTimeInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  const kst = new Date(d.getTime() + 9 * 3600_000);
  return kst.toISOString().slice(11, 16);
}

/** date 입력값(YYYY-MM-DD) 그대로 통과 */
export function dateStr(fd: FormData, key: string): string | null {
  return str(fd, key);
}
