import { MemberForm } from '../MemberForm';

export default function NewMemberPage() {
  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">멤버 추가</h1>
      </div>
      <MemberForm />
    </>
  );
}
