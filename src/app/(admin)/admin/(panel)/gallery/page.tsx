/* eslint-disable @next/next/no-img-element */
import { adminGallery, adminRaces } from '@/lib/admin/queries';
import { deleteGalleryImage, saveGalleryImage } from '@/lib/admin/actions';
import { formatDate } from '@/lib/utils';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { ImageUploader } from '@/components/admin/ImageUploader';

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: { saved?: string; error?: string };
}) {
  const [images, races] = await Promise.all([adminGallery(), adminRaces()]);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">갤러리 관리</h1>
      </div>
      <AdminBanner searchParams={searchParams} />

      {/* 업로드 폼 */}
      <div className="admin-card">
        <form action={saveGalleryImage} className="admin-form">
          <div className="admin-form-grid">
            <div className="admin-field admin-field-full">
              <ImageUploader name="image_url" bucket="gallery" label="이미지 업로드 *" />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="caption_ko">
                설명 (한국어)
              </label>
              <input className="admin-input" id="caption_ko" name="caption_ko" />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="caption_en">
                설명 (영어)
              </label>
              <input className="admin-input" id="caption_en" name="caption_en" />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="shot_at">
                촬영일
              </label>
              <input className="admin-input" id="shot_at" name="shot_at" type="date" />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="related_race_id">
                관련 경기
              </label>
              <select className="admin-select" id="related_race_id" name="related_race_id">
                <option value="">— 없음 —</option>
                {races.map((race) => (
                  <option key={race.id} value={race.id}>
                    {race.title_en}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="sort_order">
                정렬 순서
              </label>
              <input
                className="admin-input"
                id="sort_order"
                name="sort_order"
                type="number"
                defaultValue={0}
              />
            </div>
          </div>
          <div className="admin-form-footer">
            <label className="admin-checkbox">
              <input type="checkbox" name="is_published" defaultChecked />
              공개
            </label>
            <button type="submit" className="admin-btn admin-btn-primary">
              이미지 등록
            </button>
          </div>
        </form>
      </div>

      {/* 이미지 목록 */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>이미지</th>
            <th>설명</th>
            <th>촬영일</th>
            <th>공개</th>
            <th aria-label="액션" />
          </tr>
        </thead>
        <tbody>
          {images.map((image) => (
            <tr key={image.id}>
              <td>
                <img src={image.image_url} alt="" className="admin-thumb" />
              </td>
              <td>{image.caption_ko ?? image.caption_en ?? '—'}</td>
              <td style={{ fontFamily: 'var(--font-data)' }}>
                {image.shot_at ? formatDate(image.shot_at) : '—'}
              </td>
              <td>
                <span
                  className={`admin-pill ${image.is_published ? 'admin-pill-on' : 'admin-pill-off'}`}
                >
                  {image.is_published ? '공개' : '비공개'}
                </span>
              </td>
              <td>
                <div className="admin-table-actions">
                  <DeleteButton id={image.id} action={deleteGalleryImage} />
                </div>
              </td>
            </tr>
          ))}
          {images.length === 0 && (
            <tr>
              <td colSpan={5} style={{ color: 'var(--trl-gray-500)' }}>
                등록된 이미지가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
