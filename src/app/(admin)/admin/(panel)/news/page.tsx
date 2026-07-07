import Link from 'next/link';
import { adminNewsList } from '@/lib/admin/queries';
import { deleteNews } from '@/lib/admin/actions';
import { formatDate } from '@/lib/utils';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { DeleteButton } from '@/components/admin/DeleteButton';

const CATEGORY_LABEL: Record<string, string> = {
  notice: '팀 공지',
  race: '경기 안내',
  result: '경기 결과',
  activity: '팀 활동',
  member: '멤버 소식',
};

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: { saved?: string; error?: string };
}) {
  const posts = await adminNewsList();

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">소식 관리</h1>
        <Link href="/admin/news/new" className="admin-btn admin-btn-primary">
          + 소식 작성
        </Link>
      </div>
      <AdminBanner searchParams={searchParams} />

      <table className="admin-table">
        <thead>
          <tr>
            <th>작성일</th>
            <th>제목</th>
            <th>카테고리</th>
            <th>공개</th>
            <th aria-label="액션" />
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td style={{ fontFamily: 'var(--font-data)' }}>
                {formatDate(post.published_at)}
              </td>
              <td>{post.title_ko}</td>
              <td>
                <span className="admin-pill">
                  {CATEGORY_LABEL[post.category] ?? post.category}
                </span>
              </td>
              <td>
                <span
                  className={`admin-pill ${post.is_published ? 'admin-pill-on' : 'admin-pill-off'}`}
                >
                  {post.is_published ? '공개' : '비공개'}
                </span>
              </td>
              <td>
                <div className="admin-table-actions">
                  <Link
                    href={`/admin/news/${post.id}`}
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                  >
                    수정
                  </Link>
                  <DeleteButton id={post.id} action={deleteNews} />
                </div>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={5} style={{ color: 'var(--trl-gray-500)' }}>
                등록된 소식이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
