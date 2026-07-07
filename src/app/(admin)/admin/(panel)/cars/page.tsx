/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { adminCars } from '@/lib/admin/queries';
import { deleteCar } from '@/lib/admin/actions';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminCarsPage({
  searchParams,
}: {
  searchParams: { saved?: string; error?: string };
}) {
  const cars = await adminCars();

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">차량 관리</h1>
        <Link href="/admin/cars/new" className="admin-btn admin-btn-primary">
          + 차량 추가
        </Link>
      </div>
      <AdminBanner searchParams={searchParams} />

      <table className="admin-table">
        <thead>
          <tr>
            <th>이미지</th>
            <th>차량명</th>
            <th>제조사</th>
            <th>클래스</th>
            <th>공개</th>
            <th aria-label="액션" />
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>
                {car.image_url ? (
                  <img src={car.image_url} alt="" className="admin-thumb" />
                ) : (
                  '—'
                )}
              </td>
              <td>{car.name}</td>
              <td>{car.manufacturer ?? '—'}</td>
              <td>{car.car_class ?? '—'}</td>
              <td>
                <span
                  className={`admin-pill ${car.is_published ? 'admin-pill-on' : 'admin-pill-off'}`}
                >
                  {car.is_published ? '공개' : '비공개'}
                </span>
              </td>
              <td>
                <div className="admin-table-actions">
                  <Link
                    href={`/admin/cars/${car.id}`}
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                  >
                    수정
                  </Link>
                  <DeleteButton id={car.id} action={deleteCar} />
                </div>
              </td>
            </tr>
          ))}
          {cars.length === 0 && (
            <tr>
              <td colSpan={6} style={{ color: 'var(--trl-gray-500)' }}>
                등록된 차량이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
