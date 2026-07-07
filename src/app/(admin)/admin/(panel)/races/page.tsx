import Link from 'next/link';
import { adminRaces } from '@/lib/admin/queries';
import { deleteRace } from '@/lib/admin/actions';
import { formatDate, formatRacePlatform, formatResultPosition } from '@/lib/utils';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { DeleteButton } from '@/components/admin/DeleteButton';

const STATUS_LABEL: Record<string, string> = {
  upcoming: '예정',
  live: '진행 중',
  completed: '완료',
  cancelled: '취소',
};

export default async function AdminRacesPage({
  searchParams,
}: {
  searchParams: { saved?: string; error?: string };
}) {
  const races = await adminRaces();

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">경기 관리</h1>
        <Link href="/admin/races/new" className="admin-btn admin-btn-primary">
          + 경기 등록
        </Link>
      </div>
      <AdminBanner searchParams={searchParams} />

      <table className="admin-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>경기</th>
            <th>서킷</th>
            <th>플랫폼</th>
            <th>상태</th>
            <th>결과</th>
            <th>공개</th>
            <th aria-label="액션" />
          </tr>
        </thead>
        <tbody>
          {races.map((race) => (
            <tr key={race.id}>
              <td style={{ fontFamily: 'var(--font-data)' }}>{formatDate(race.starts_at)}</td>
              <td>{race.title_en}</td>
              <td>{race.circuit_name ?? '—'}</td>
              <td>{formatRacePlatform(race.platform)}</td>
              <td>
                <span className="admin-pill">{STATUS_LABEL[race.status] ?? race.status}</span>
              </td>
              <td style={{ fontFamily: 'var(--font-data)' }}>
                {race.result
                  ? formatResultPosition(race.result.overall_pos, race.result.finish_status)
                  : '—'}
              </td>
              <td>
                <span
                  className={`admin-pill ${race.is_published ? 'admin-pill-on' : 'admin-pill-off'}`}
                >
                  {race.is_published ? '공개' : '비공개'}
                </span>
              </td>
              <td>
                <div className="admin-table-actions">
                  <Link
                    href={`/admin/races/${race.id}`}
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                  >
                    수정
                  </Link>
                  <DeleteButton id={race.id} action={deleteRace} />
                </div>
              </td>
            </tr>
          ))}
          {races.length === 0 && (
            <tr>
              <td colSpan={8} style={{ color: 'var(--trl-gray-500)' }}>
                등록된 경기가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
