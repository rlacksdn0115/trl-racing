import Link from 'next/link';
import type { Car, Member } from '@/types/content';
import type { AdminRace } from '@/lib/admin/queries';
import { saveRace } from '@/lib/admin/actions';
import { isoToKstDateInput, isoToKstTimeInput } from '@/lib/admin/form';
import { ImageUploader } from '@/components/admin/ImageUploader';

export function RaceForm({
  race,
  members,
  cars,
}: {
  race?: AdminRace | null;
  members: Member[];
  cars: Car[];
}) {
  const memberIds = new Set((race?.race_members ?? []).map((rm) => rm.member_id));
  const carIds = new Set((race?.race_cars ?? []).map((rc) => rc.car_id));

  return (
    <form action={saveRace} className="admin-form">
      {race && <input type="hidden" name="id" value={race.id} />}

      <fieldset className="admin-fieldset">
        <legend>기본 정보</legend>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label className="admin-label" htmlFor="title_en">
              영문 경기명 <span className="admin-required">*</span>
            </label>
            <input
              className="admin-input"
              id="title_en"
              name="title_en"
              defaultValue={race?.title_en ?? race?.title_ko ?? ''}
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
              defaultValue={race?.slug ?? ''}
              placeholder="sebring-3h-2026"
              pattern="[a-z0-9-]+"
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="status">
              상태
            </label>
            <select
              className="admin-select"
              id="status"
              name="status"
              defaultValue={race?.status ?? 'upcoming'}
            >
              <option value="upcoming">예정</option>
              <option value="live">진행 중</option>
              <option value="completed">완료</option>
              <option value="cancelled">취소</option>
            </select>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="platform">
              참가 플랫폼
            </label>
            <input
              className="admin-input"
              id="platform"
              name="platform"
              list="race-platform-options"
              defaultValue={race?.platform ?? 'iRacing'}
              placeholder="iRacing / Assetto Corsa"
            />
            <datalist id="race-platform-options">
              <option value="iRacing" />
              <option value="Assetto Corsa" />
            </datalist>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="starts_at_date">
              경기 날짜 <span className="admin-required">*</span>
            </label>
            <input
              className="admin-input"
              id="starts_at_date"
              name="starts_at_date"
              type="date"
              defaultValue={isoToKstDateInput(race?.starts_at)}
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="starts_at_time">
              경기 시간 (KST)
            </label>
            <input
              className="admin-input"
              id="starts_at_time"
              name="starts_at_time"
              type="time"
              defaultValue={isoToKstTimeInput(race?.starts_at)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="series">
              대회 / 시리즈명
            </label>
            <input
              className="admin-input"
              id="series"
              name="series"
              defaultValue={race?.series ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="circuit_name">
              서킷
            </label>
            <input
              className="admin-input"
              id="circuit_name"
              name="circuit_name"
              defaultValue={race?.circuit_name ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="race_length">
              경기 길이
            </label>
            <input
              className="admin-input"
              id="race_length"
              name="race_length"
              defaultValue={race?.race_length ?? ''}
              placeholder="3H / 40 Laps"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="car_class">
              차량 / 클래스
            </label>
            <input
              className="admin-input"
              id="car_class"
              name="car_class"
              defaultValue={race?.car_class ?? ''}
              placeholder="GT3"
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
              defaultValue={race?.youtube_url ?? ''}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>출전</legend>
        <div className="admin-form-grid">
          <div className="admin-field">
            <span className="admin-label">출전 멤버</span>
            {members.map((member) => (
              <label key={member.id} className="admin-checkbox">
                <input
                  type="checkbox"
                  name="member_ids"
                  value={member.id}
                  defaultChecked={memberIds.has(member.id)}
                />
                {member.racing_number} — {member.name}
              </label>
            ))}
          </div>
          <div className="admin-field">
            <span className="admin-label">출전 차량</span>
            {cars.length === 0 && <p className="admin-hint">등록된 차량이 없습니다.</p>}
            {cars.map((car) => (
              <label key={car.id} className="admin-checkbox">
                <input
                  type="checkbox"
                  name="car_ids"
                  value={car.id}
                  defaultChecked={carIds.has(car.id)}
                />
                {car.name}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>설명 · 서킷 정보</legend>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label className="admin-label" htmlFor="description_ko">
              경기 설명 (한국어)
            </label>
            <textarea
              className="admin-textarea"
              id="description_ko"
              name="description_ko"
              defaultValue={race?.description_ko ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="description_en">
              경기 설명 (영어)
            </label>
            <textarea
              className="admin-textarea"
              id="description_en"
              name="description_en"
              defaultValue={race?.description_en ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="circuit_info_ko">
              서킷 정보 (한국어)
            </label>
            <textarea
              className="admin-textarea"
              id="circuit_info_ko"
              name="circuit_info_ko"
              defaultValue={race?.circuit_info_ko ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="circuit_info_en">
              서킷 정보 (영어)
            </label>
            <textarea
              className="admin-textarea"
              id="circuit_info_en"
              name="circuit_info_en"
              defaultValue={race?.circuit_info_en ?? ''}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>결과 (경기 완료 후 입력)</legend>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label className="admin-label" htmlFor="overall_pos">
              전체 순위
            </label>
            <input
              className="admin-input"
              id="overall_pos"
              name="overall_pos"
              type="number"
              defaultValue={race?.result?.overall_pos ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="class_pos">
              클래스 순위
            </label>
            <input
              className="admin-input"
              id="class_pos"
              name="class_pos"
              type="number"
              defaultValue={race?.result?.class_pos ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="qualifying_pos">
              예선 순위
            </label>
            <input
              className="admin-input"
              id="qualifying_pos"
              name="qualifying_pos"
              type="number"
              defaultValue={race?.result?.qualifying_pos ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="fastest_lap">
              패스티스트 랩
            </label>
            <input
              className="admin-input"
              id="fastest_lap"
              name="fastest_lap"
              defaultValue={race?.result?.fastest_lap ?? ''}
              placeholder="1:58.482"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="incidents">
              인시던트
            </label>
            <input
              className="admin-input"
              id="incidents"
              name="incidents"
              type="number"
              defaultValue={race?.result?.incidents ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="finish_status">
              완주 여부
            </label>
            <input
              className="admin-input"
              id="finish_status"
              name="finish_status"
              defaultValue={race?.result?.finish_status ?? ''}
              placeholder="Finished / DNF"
            />
            <label className="admin-checkbox" style={{ marginTop: 8 }}>
              <input
                type="checkbox"
                name="result_dnf"
                defaultChecked={race?.result?.finish_status?.toUpperCase() === 'DNF'}
              />
              DNF
            </label>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="notes_ko">
              특이사항 (한국어)
            </label>
            <textarea
              className="admin-textarea"
              id="notes_ko"
              name="notes_ko"
              defaultValue={race?.result?.notes_ko ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="notes_en">
              특이사항 (영어)
            </label>
            <textarea
              className="admin-textarea"
              id="notes_en"
              name="notes_en"
              defaultValue={race?.result?.notes_en ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="review_ko">
              경기 후기 (한국어)
            </label>
            <textarea
              className="admin-textarea"
              id="review_ko"
              name="review_ko"
              defaultValue={race?.review_ko ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="review_en">
              경기 후기 (영어)
            </label>
            <textarea
              className="admin-textarea"
              id="review_en"
              name="review_en"
              defaultValue={race?.review_en ?? ''}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>이미지</legend>
        <div className="admin-form-grid">
          <ImageUploader
            name="thumbnail_url"
            bucket="races"
            defaultValue={race?.thumbnail_url}
            label="경기 썸네일"
          />
          <ImageUploader
            name="track_map_url"
            bucket="races"
            defaultValue={race?.track_map_url}
            label="트랙 맵"
          />
        </div>
      </fieldset>

      <div className="admin-form-footer">
        <label className="admin-checkbox">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={race?.is_published ?? true}
          />
          공개
        </label>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link href="/admin/races" className="admin-btn admin-btn-ghost">
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
