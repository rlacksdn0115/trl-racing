'use client';

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import styles from './ImageUploader.module.css';

/**
 * Supabase Storage 업로드 + 미리보기 (design.md §24).
 * 업로드된 public URL을 hidden input(name)으로 폼에 전달한다.
 * URL 직접 입력도 허용 (정적 /public 경로 등).
 */
export function ImageUploader({
  name,
  bucket,
  defaultValue,
  label,
}: {
  name: string;
  bucket: string;
  defaultValue?: string | null;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split('.').pop() ?? 'png';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError(`업로드 실패: ${uploadError.message}`);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className={styles.uploader}>
      {label && <span className="admin-label">{label}</span>}
      <input type="hidden" name={name} value={url} />

      <div className={styles.row}>
        {url ? (
          <img src={url} alt="" className={styles.preview} />
        ) : (
          <span className={styles.previewEmpty} aria-hidden />
        )}
        <div className={styles.controls}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className={styles.file}
            disabled={uploading}
          />
          <input
            type="text"
            className="admin-input"
            placeholder="또는 이미지 URL 직접 입력"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className={styles.actions}>
            {uploading && <span className={styles.status}>업로드 중…</span>}
            {url && (
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => {
                  setUrl('');
                  if (fileRef.current) fileRef.current.value = '';
                }}
              >
                이미지 제거
              </button>
            )}
          </div>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
