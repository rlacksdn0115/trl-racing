'use client';

/**
 * 삭제 확인 버튼 (design.md §24 — 삭제는 확인 절차 필요).
 */
export function DeleteButton({
  id,
  action,
  label = '삭제',
}: {
  id: string;
  action: (fd: FormData) => Promise<void>;
  label?: string;
}) {
  return (
    <form
      action={action}
      style={{ display: 'inline-flex' }}
      onSubmit={(event) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="admin-btn admin-btn-danger admin-btn-sm">
        {label}
      </button>
    </form>
  );
}
