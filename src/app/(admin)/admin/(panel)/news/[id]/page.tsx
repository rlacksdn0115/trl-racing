import { notFound } from 'next/navigation';
import { adminNewsPost, adminRaces } from '@/lib/admin/queries';
import { NewsForm } from '../NewsForm';

export default async function EditNewsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [post, races] = await Promise.all([adminNewsPost(id), adminRaces()]);
  if (!post) notFound();

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">소식 수정</h1>
      </div>
      <NewsForm post={post} races={races} />
    </>
  );
}
