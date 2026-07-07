import Link from 'next/link';
import type { NewsPost, Race } from '@/types/content';
import { saveNews } from '@/lib/admin/actions';
import { ImageUploader } from '@/components/admin/ImageUploader';

export function NewsForm({
  post,
  races,
}: {
  post?: NewsPost | null;
  races: Pick<Race, 'id' | 'title_en'>[];
}) {
  return (
    <form action={saveNews} className="admin-form">
      {post && <input type="hidden" name="id" value={post.id} />}

      <fieldset className="admin-fieldset">
        <legend>기본 정보</legend>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label className="admin-label" htmlFor="title_ko">
              제목 (한국어) <span className="admin-required">*</span>
            </label>
            <input
              className="admin-input"
              id="title_ko"
              name="title_ko"
              defaultValue={post?.title_ko ?? ''}
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="title_en">
              제목 (영어) <span className="admin-required">*</span>
            </label>
            <input
              className="admin-input"
              id="title_en"
              name="title_en"
              defaultValue={post?.title_en ?? ''}
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="slug">
              Slug (URL) <span className="admin-required">*</span>
            </label>
            <input
              className="admin-input"
              id="slug"
              name="slug"
              defaultValue={post?.slug ?? ''}
              pattern="[a-z0-9-]+"
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="category">
              카테고리
            </label>
            <select
              className="admin-select"
              id="category"
              name="category"
              defaultValue={post?.category ?? 'notice'}
            >
              <option value="notice">팀 공지</option>
              <option value="race">경기 안내</option>
              <option value="result">경기 결과</option>
              <option value="activity">팀 활동</option>
              <option value="member">멤버 소식</option>
            </select>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="author">
              작성자
            </label>
            <input
              className="admin-input"
              id="author"
              name="author"
              defaultValue={post?.author ?? 'TRL Racing'}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="related_race_id">
              관련 경기
            </label>
            <select
              className="admin-select"
              id="related_race_id"
              name="related_race_id"
              defaultValue={post?.related_race_id ?? ''}
            >
              <option value="">— 없음 —</option>
              {races.map((race) => (
                <option key={race.id} value={race.id}>
                  {race.title_en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>내용</legend>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label className="admin-label" htmlFor="summary_ko">
              요약 (한국어)
            </label>
            <textarea
              className="admin-textarea"
              id="summary_ko"
              name="summary_ko"
              style={{ minHeight: 72 }}
              defaultValue={post?.summary_ko ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="summary_en">
              요약 (영어)
            </label>
            <textarea
              className="admin-textarea"
              id="summary_en"
              name="summary_en"
              style={{ minHeight: 72 }}
              defaultValue={post?.summary_en ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="body_ko">
              본문 (한국어)
            </label>
            <textarea
              className="admin-textarea"
              id="body_ko"
              name="body_ko"
              style={{ minHeight: 220 }}
              defaultValue={post?.body_ko ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="body_en">
              본문 (영어)
            </label>
            <textarea
              className="admin-textarea"
              id="body_en"
              name="body_en"
              style={{ minHeight: 220 }}
              defaultValue={post?.body_en ?? ''}
            />
          </div>
          <div className="admin-field admin-field-full">
            <ImageUploader
              name="cover_image_url"
              bucket="news"
              defaultValue={post?.cover_image_url}
              label="대표 이미지"
            />
          </div>
        </div>
      </fieldset>

      <div className="admin-form-footer">
        <label className="admin-checkbox">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={post?.is_published ?? true}
          />
          공개
        </label>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link href="/admin/news" className="admin-btn admin-btn-ghost">
            취소
          </Link>
          <button type="submit" className="admin-btn admin-btn-primary">
            저장
          </button>
        </div>
      </div>
    </form>
  );
}
