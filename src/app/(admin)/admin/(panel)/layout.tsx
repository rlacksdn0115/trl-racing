import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { UnsavedChangesGuard } from '@/components/admin/UnsavedChangesGuard';

/** /admin/** (로그인 제외) — 세션 확인 + 사이드바 셸 */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured) redirect('/admin/login');

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="admin-shell">
      <UnsavedChangesGuard />
      <AdminSidebar email={user.email ?? ''} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
