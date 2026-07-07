/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { adminMembers } from '@/lib/admin/queries';
import { deleteMember } from '@/lib/admin/actions';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: { saved?: string; error?: string };
}) {
  const members = await adminMembers();

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">멤버 관리</h1>
        <Link href="/admin/members/new" className="admin-btn admin-btn-primary">
          + 멤버 추가
        </Link>
      </div>
      <AdminBanner searchParams={searchParams} />

      <table className="admin-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>헬멧</th>
            <th>이름</th>
            <th>역할</th>
            <th>공개</th>
            <th>정렬</th>
            <th aria-label="액션" />
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td style={{ fontFamily: 'var(--font-data)' }}>{member.racing_number}</td>
              <td>
                {member.helmet_image_url ? (
                  <img src={member.helmet_image_url} alt="" className="admin-thumb" />
                ) : (
                  '—'
                )}
              </td>
              <td>{member.name}</td>
              <td>{member.role === 'leader' ? '팀 리더' : '드라이버'}</td>
              <td>
                <span
                  className={`admin-pill ${member.is_published ? 'admin-pill-on' : 'admin-pill-off'}`}
                >
                  {member.is_published ? '공개' : '비공개'}
                </span>
              </td>
              <td style={{ fontFamily: 'var(--font-data)' }}>{member.sort_order}</td>
              <td>
                <div className="admin-table-actions">
                  <Link
                    href={`/admin/members/${member.id}`}
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                  >
                    수정
                  </Link>
                  <DeleteButton id={member.id} action={deleteMember} />
                </div>
              </td>
            </tr>
          ))}
          {members.length === 0 && (
            <tr>
              <td colSpan={7} style={{ color: 'var(--trl-gray-500)' }}>
                등록된 멤버가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
