import { CarForm } from '../CarForm';

export default function NewCarPage() {
  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">차량 추가</h1>
      </div>
      <CarForm />
    </>
  );
}
