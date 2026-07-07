import Link from 'next/link';
import type { Member } from '@/types/content';
import { saveMember } from '@/lib/admin/actions';
import { ImageUploader } from '@/components/admin/ImageUploader';

export function MemberForm({ member }: { member?: Member | null }) {
  return (
    <form action={saveMember} className="admin-form">
      {member && <input type="hidden" name="id" value={member.id} />}

      <fieldset className="admin-fieldset">
        <legend>기본 정보</legend>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label className="admin-label" htmlFor="name">
              영문 이름 <span className="admin-required">*</span>
            </label>
            <input
              className="admin-input"
              id="name"
              name="name"
              defaultValue={member?.name ?? ''}
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
              defaultValue={member?.slug ?? ''}
              placeholder="junhee-kim"
              pattern="[a-z0-9-]+"
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="racing_number">
              레이싱 번호 <span className="admin-required">*</span>
            </label>
            <input
              className="admin-input"
              id="racing_number"
              name="racing_number"
              defaultValue={member?.racing_number ?? ''}
              placeholder="01"
              required
            />
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
              step="1"
              defaultValue={member?.sort_order ?? 0}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="role">
              역할
            </label>
            <select
              className="admin-select"
              id="role"
              name="role"
              defaultValue={member?.role ?? 'driver'}
            >
              <option value="driver">드라이버</option>
              <option value="leader">팀 리더</option>
            </select>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="field">
              활동 분야
            </label>
            <input
              className="admin-input"
              id="field"
              name="field"
              defaultValue={member?.field ?? ''}
              placeholder="온로드 / GT / Formula"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="birth_year">
              출생 연도
            </label>
            <input
              className="admin-input"
              id="birth_year"
              name="birth_year"
              type="number"
              defaultValue={member?.birth_year ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="favorite_car">
              선호 차량
            </label>
            <input
              className="admin-input"
              id="favorite_car"
              name="favorite_car"
              defaultValue={member?.favorite_car ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="favorite_track">
              선호 트랙
            </label>
            <input
              className="admin-input"
              id="favorite_track"
              name="favorite_track"
              defaultValue={member?.favorite_track ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="wheel_base">
              휠 베이스
            </label>
            <input
              className="admin-input"
              id="wheel_base"
              name="wheel_base"
              defaultValue={member?.wheel_base ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="pedal">
              페달
            </label>
            <input
              className="admin-input"
              id="pedal"
              name="pedal"
              defaultValue={member?.pedal ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="instagram">
              Instagram (@ 제외)
            </label>
            <input
              className="admin-input"
              id="instagram"
              name="instagram"
              defaultValue={member?.instagram ?? ''}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>소개문</legend>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label className="admin-label" htmlFor="bio_ko">
              소개 (한국어)
            </label>
            <textarea
              className="admin-textarea"
              id="bio_ko"
              name="bio_ko"
              defaultValue={member?.bio_ko ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="bio_en">
              소개 (영어)
            </label>
            <textarea
              className="admin-textarea"
              id="bio_en"
              name="bio_en"
              defaultValue={member?.bio_en ?? ''}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>이미지</legend>
        <div className="admin-form-grid">
          <ImageUploader
            name="helmet_image_url"
            bucket="members"
            defaultValue={member?.helmet_image_url}
            label="헬멧 이미지"
          />
          <ImageUploader
            name="profile_image_url"
            bucket="members"
            defaultValue={member?.profile_image_url}
            label="프로필 이미지"
          />
        </div>
      </fieldset>

      <div className="admin-form-footer">
        <label className="admin-checkbox">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={member?.is_published ?? true}
          />
          공개
        </label>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link href="/admin/members" className="admin-btn admin-btn-ghost">
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
