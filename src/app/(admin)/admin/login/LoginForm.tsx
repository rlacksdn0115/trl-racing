'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import styles from './login.module.css';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get('email')),
      password: String(form.get('password')),
    });

    if (signInError) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
      setLoading(false);
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className="admin-field">
        <label className="admin-label" htmlFor="email">
          이메일
        </label>
        <input
          className="admin-input"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="admin-field">
        <label className="admin-label" htmlFor="password">
          비밀번호
        </label>
        <input
          className="admin-input"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <button
        type="submit"
        className="admin-btn admin-btn-primary"
        disabled={loading}
      >
        {loading ? '로그인 중…' : '로그인'}
      </button>
    </form>
  );
}
