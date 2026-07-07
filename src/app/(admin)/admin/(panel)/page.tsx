import Link from 'next/link';
import { adminCounts, adminRaces } from '@/lib/admin/queries';
import { formatDate, formatRacePlatform } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const [counts, races] = await Promise.all([adminCounts(), adminRaces()]);
  const recent = races.slice(0, 5);

  const stats = [
    { label: '멤버', value: counts.members, href: '/admin/members' },
    { label: '예정 경기', value: counts.upcoming, href: '/admin/races' },
    { label: '완료 경기', value: counts.completed, href: '/admin/races' },
    { label: '소식', value: counts.news, href: '/admin/news' },
    { label: '갤러리', value: counts.gallery, href: '/admin/gallery' },
  ];

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">대시보드</h1>
        <Link href="/admin/races/new" className="admin-btn admin-btn-primary">
          + 경기 등록
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="admin-card" style={{ margin: 0 }}>
            <p
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 'var(--text-xs)',
                color: 'var(--trl-gray-500)',
                letterSpacing: '0.08em',
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-brand), var(--font-display)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 700,
                color: 'var(--trl-white)',
                marginTop: 'var(--space-2)',
              }}
            >
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <h2
        className="admin-label"
        style={{ display: 'block', marginBottom: 'var(--space-4)' }}
      >
        최근 경기
      </h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>경기</th>
            <th>플랫폼</th>
            <th>상태</th>
            <th aria-label="액션" />
          </tr>
        </thead>
        <tbody>
          {recent.map((race) => (
            <tr key={race.id}>
              <td style={{ fontFamily: 'var(--font-data)' }}>{formatDate(race.starts_at)}</td>
              <td>{race.title_en}</td>
              <td>{formatRacePlatform(race.platform)}</td>
              <td>
                <span className="admin-pill">{race.status}</span>
              </td>
              <td>
                <div className="admin-table-actions">
                  <Link
                    href={`/admin/races/${race.id}`}
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                  >
                    수정
                  </Link>
                </div>
              </td>
            </tr>
          ))}
          {recent.length === 0 && (
            <tr>
              <td colSpan={5} style={{ color: 'var(--trl-gray-500)' }}>
                등록된 경기가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
