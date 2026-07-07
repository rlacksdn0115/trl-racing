import { adminRaces } from '@/lib/admin/queries';
import { NewsForm } from '../NewsForm';

export default async function NewNewsPage() {
  const races = await adminRaces();

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">소식 작성</h1>
      </div>
      <NewsForm races={races} />
    </>
  );
}
