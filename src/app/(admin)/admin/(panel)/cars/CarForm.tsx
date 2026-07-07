import Link from 'next/link';
import type { Car } from '@/types/content';
import { saveCar } from '@/lib/admin/actions';
import { ImageUploader } from '@/components/admin/ImageUploader';

export function CarForm({ car }: { car?: Car | null }) {
  return (
    <form action={saveCar} className="admin-form">
      {car && <input type="hidden" name="id" value={car.id} />}

      <fieldset className="admin-fieldset">
        <legend>차량 정보</legend>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label className="admin-label" htmlFor="name">
              차량명 <span className="admin-required">*</span>
            </label>
            <input
              className="admin-input"
              id="name"
              name="name"
              defaultValue={car?.name ?? ''}
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="manufacturer">
              제조사
            </label>
            <input
              className="admin-input"
              id="manufacturer"
              name="manufacturer"
              defaultValue={car?.manufacturer ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="car_class">
              클래스
            </label>
            <input
              className="admin-input"
              id="car_class"
              name="car_class"
              defaultValue={car?.car_class ?? ''}
              placeholder="GT3"
            />
          </div>
          <div className="admin-field admin-field-full">
            <ImageUploader
              name="image_url"
              bucket="cars"
              defaultValue={car?.image_url}
              label="차량 이미지"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="description_ko">
              설명 (한국어)
            </label>
            <textarea
              className="admin-textarea"
              id="description_ko"
              name="description_ko"
              defaultValue={car?.description_ko ?? ''}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="description_en">
              설명 (영어)
            </label>
            <textarea
              className="admin-textarea"
              id="description_en"
              name="description_en"
              defaultValue={car?.description_en ?? ''}
            />
          </div>
        </div>
      </fieldset>

      <div className="admin-form-footer">
        <label className="admin-checkbox">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={car?.is_published ?? true}
          />
          공개
        </label>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link href="/admin/cars" className="admin-btn admin-btn-ghost">
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
