import { adminSettingsMap } from '@/lib/admin/queries';
import { saveSettings } from '@/lib/admin/actions';
import { AdminBanner } from '@/components/admin/AdminBanner';

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: { saved?: string; error?: string };
}) {
  const settings = await adminSettingsMap();

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">사이트 설정</h1>
      </div>
      <AdminBanner searchParams={searchParams} />

      <form action={saveSettings} className="admin-form">
        <fieldset className="admin-fieldset">
          <legend>Hero</legend>
          <div className="admin-form-grid">
            <div className="admin-field admin-field-full">
              <label className="admin-label" htmlFor="hero_video_url">
                Hero 영상 URL 목록 (YouTube 또는 mp4)
              </label>
              <textarea
                className="admin-textarea"
                id="hero_video_url"
                name="hero_video_url"
                defaultValue={settings.hero_video_url ?? ''}
                placeholder={`https://youtube.com/watch?v=...\nhttps://example.com/video.mp4`}
                style={{ minHeight: 120 }}
              />
              <p className="admin-hint">
                한 줄에 하나씩 입력합니다. 비워두면 정적 배경으로 표시됩니다. 모바일에서는 항상 정적 배경을 사용합니다.
              </p>
            </div>
          </div>
        </fieldset>

        <fieldset className="admin-fieldset">
          <legend>모집 · 링크</legend>
          <div className="admin-form-grid">
            <div className="admin-field admin-field-full">
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  name="recruiting"
                  defaultChecked={settings.recruiting !== 'false'}
                />
                멤버 모집 중
              </label>
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="discord_url">
                Discord URL
              </label>
              <input
                className="admin-input"
                id="discord_url"
                name="discord_url"
                type="url"
                defaultValue={settings.discord_url ?? ''}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="instagram_url">
                Instagram URL
              </label>
              <input
                className="admin-input"
                id="instagram_url"
                name="instagram_url"
                type="url"
                defaultValue={settings.instagram_url ?? ''}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="youtube_url">
                YouTube URL
              </label>
              <input
                className="admin-input"
                id="youtube_url"
                name="youtube_url"
                type="url"
                defaultValue={settings.youtube_url ?? ''}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="contact_url">
                문의 / 지원 폼 URL
              </label>
              <input
                className="admin-input"
                id="contact_url"
                name="contact_url"
                type="url"
                defaultValue={settings.contact_url ?? ''}
              />
            </div>
          </div>
        </fieldset>

        <div className="admin-form-footer">
          <span className="admin-hint">저장 즉시 공개 사이트에 반영됩니다.</span>
          <button type="submit" className="admin-btn admin-btn-primary">
            저장
          </button>
        </div>
      </form>
    </>
  );
}
