import { notFound } from 'next/navigation';
import { adminMember } from '@/lib/admin/queries';
import { MemberForm } from '../MemberForm';

export default async function EditMemberPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const member = await adminMember(id);
  if (!member) notFound();

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">멤버 수정 — {member.name}</h1>
      </div>
      <MemberForm member={member} />
    </>
  );
}
