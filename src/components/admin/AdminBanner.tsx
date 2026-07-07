/** 목록 페이지 상단 저장/오류 배너 — 서버 액션의 ?saved / ?error 쿼리를 표시 */
export function AdminBanner({
  searchParams,
}: {
  searchParams: { saved?: string; error?: string };
}) {
  if (searchParams.error) {
    return (
      <p className="admin-banner admin-banner-error" role="alert">
        오류: {searchParams.error}
      </p>
    );
  }
  if (searchParams.saved) {
    return <p className="admin-banner admin-banner-success">저장되었습니다.</p>;
  }
  return null;
}
