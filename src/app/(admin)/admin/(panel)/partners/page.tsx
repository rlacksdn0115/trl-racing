import { isSupabaseConfigured } from '@/lib/supabase/config';
import { PARTNER_DEFAULTS, readPartners } from '@/types/content';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { adminSettingsMap } from '@/lib/admin/queries';
import { DeleteButton } from '@/components/admin/DeleteButton';
import {
  savePartnerSettings,
  savePartner,
  deletePartner,
} from '@/lib/admin/actions';
import { AdminBanner } from '@/components/admin/AdminBanner';

export default async function AdminPartnersPage({
  searchParams,
}: {
  searchParams: {
    saved?: string;
    error?: string;
    edit?: string;
  };
}) {
  const preview =
    !isSupabaseConfigured && process.env.NODE_ENV === 'development';

  const settings = preview ? {} : await adminSettingsMap();
  const partnerSettings = { ...PARTNER_DEFAULTS, ...settings };
  const partners = readPartners(partnerSettings);
  const editing = partners.find(
    (partner) => partner.id === searchParams.edit,
  );

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">스폰서 관리</h1>
      </div>

      <AdminBanner searchParams={searchParams} />

      {preview && (
        <p className="admin-hint" role="status">
          로컬 미리보기입니다. 저장·삭제·이미지 업로드는
          비활성화되어 있습니다.
        </p>
      )}

      <p className="admin-hint" id="partner-management">
        파트너를 등록하고 목록에서 수정·삭제할 수 있습니다.
        정렬 순서가 작은 파트너부터 표시됩니다.
      </p>

      {/* 등록 · 수정 폼 */}
      <div className="admin-card" style={{ marginTop: 24 }}>
        <form
          action={preview ? undefined : savePartner}
          className="admin-form"
          key={editing?.id ?? 'new'}
        >
          <fieldset
            disabled={preview}
            style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
          >
            <input
              type="hidden"
              name="id"
              value={editing?.id ?? ''}
            />

            <h3>{editing ? '파트너 수정' : '파트너 등록'}</h3>

            <div className="admin-form-grid">
              <div className="admin-field admin-field-full">
                <ImageUploader
                  name="logo"
                  bucket="gallery"
                  label="파트너 로고"
                  defaultValue={editing?.logo}
                />
              </div>

              {[
                ['name', '파트너 이름 *'],
                ['url', '홈페이지 URL'],
                ['since', '협업 시작 연도'],
                ['sort_order', '정렬 순서'],
                ['description_ko', '소개 (한국어)'],
                ['description_en', '소개 (영어)'],
                ['activities_ko', '함께하는 곳 (한국어)'],
                ['activities_en', '함께하는 곳 (영어)'],
              ].map(([key, label]) => (
                <div className="admin-field" key={key}>
                  <label
                    className="admin-label"
                    htmlFor={`entry_${key}`}
                  >
                    {label}
                  </label>
                  <input
                    className="admin-input"
                    id={`entry_${key}`}
                    name={key}
                    type={
                      key === 'url'
                        ? 'url'
                        : key === 'sort_order'
                          ? 'number'
                          : 'text'
                    }
                    required={key === 'name'}
                    defaultValue={
                      editing?.[key] ??
                      (key === 'sort_order' ? '0' : '')
                    }
                  />
                </div>
              ))}
            </div>

            <div className="admin-form-footer">
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  name="visible"
                  defaultChecked={
                    editing ? editing.visible === 'true' : true
                  }
                />
                공개
              </label>

              <button
                type="submit"
                className="admin-btn admin-btn-primary"
              >
                {editing ? '수정 저장' : '파트너 등록'}
              </button>
            </div>
          </fieldset>

          {editing && (
            <a
              href="/admin/partners#partner-management"
              className="admin-btn admin-btn-ghost"
            >
              수정 취소 · 새 파트너 등록
            </a>
          )}
        </form>
      </div>

      {/* 등록된 파트너 목록 */}
      <div style={{ overflowX: 'auto', marginTop: 24 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>로고</th>
              <th>파트너</th>
              <th>협업 시작</th>
              <th>정렬</th>
              <th>공개</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {partners.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  등록된 파트너가 없습니다. 위 폼에서 파트너를
                  등록해 주세요.
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr key={partner.id}>
                  <td>
                    {partner.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={partner.logo}
                        alt={`${partner.name} 로고`}
                        style={{
                          width: 56,
                          height: 56,
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{partner.name}</td>
                  <td>{partner.since || '—'}</td>
                  <td>{partner.sort_order || '0'}</td>
                  <td>
                    {partner.visible === 'true' ? '공개' : '비공개'}
                  </td>
                  <td>
                    <a
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      href={`/admin/partners?edit=${encodeURIComponent(partner.id)}#partner-management`}
                    >
                      수정
                    </a>
                    {!preview && (
                      <DeleteButton
                        id={partner.id}
                        action={deletePartner}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 메인 페이지 소개 · 모집 설정 */}
      <h2 className="admin-title" style={{ marginTop: 40 }}>
        소개 · 모집 설정
      </h2>

      <form
        action={preview ? undefined : savePartnerSettings}
        className="admin-form"
        style={{ marginTop: 24 }}
      >
        <fieldset
          disabled={preview}
          style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
        >
          <fieldset className="admin-fieldset">
            <legend>파트너 소개 · 모집</legend>

            <p className="admin-hint">
              메인 갤러리 아래 표시됩니다. 실적은 직접 입력한
              값만 표시합니다. 문의 링크는 https:// 또는
              mailto: 주소를 입력하세요.
            </p>

            <div className="admin-form-grid">
              {['partners_visible', 'partner_recruiting'].map(
                (key) => (
                  <label key={key} className="admin-checkbox">
                    <input
                      type="checkbox"
                      name={key}
                      defaultChecked={partnerSettings[key] === 'true'}
                    />
                    {key === 'partners_visible'
                      ? '파트너 섹션 공개'
                      : '파트너 모집 중'}
                  </label>
                ),
              )}

              {[
                ['partner_heading_ko', '모집 제목 (KO)'],
                ['partner_heading_en', '모집 제목 (EN)'],
                ['partner_intro_ko', '모집 소개 (KO)'],
                ['partner_intro_en', '모집 소개 (EN)'],
                ['partner_contact_url', '파트너십 문의 주소'],
                ['partner_entries', '출전 횟수'],
                ['partner_podiums', '포디움 횟수'],
                ['partner_finish_rate', '완주율 (%)'],
              ].map(([key, label]) => (
                <div className="admin-field" key={key}>
                  <label className="admin-label" htmlFor={key}>
                    {label}
                  </label>
                  <input
                    className="admin-input"
                    id={key}
                    name={key}
                    defaultValue={partnerSettings[key]}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <div className="admin-form-footer">
            <span className="admin-hint">
              {preview
                ? '미리보기에서는 저장할 수 없습니다.'
                : '저장 즉시 메인 페이지에 반영됩니다.'}
            </span>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
            >
              모집 설정 저장
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );
}
