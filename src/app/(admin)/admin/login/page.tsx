import Image from 'next/image';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { LoginForm } from './LoginForm';
import styles from './login.module.css';

export default function AdminLoginPage() {
  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <Image
          src="/brand/logo-dark.png"
          alt="TRL Racing"
          width={120}
          height={83}
          className={styles.logo}
          priority
        />
        <h1 className={styles.title}>ADMIN LOGIN</h1>

        {isSupabaseConfigured ? (
          <LoginForm />
        ) : (
          <p className={styles.notice}>
            Supabase 환경 변수가 설정되지 않았습니다.
            <br />
            <code>.env.local</code> 에 <code>NEXT_PUBLIC_SUPABASE_URL</code> 과{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> 를 설정한 뒤 다시 시도하세요.
            (README 참고)
          </p>
        )}
      </div>
    </main>
  );
}
