import { notFound } from 'next/navigation';
import { adminCar } from '@/lib/admin/queries';
import { CarForm } from '../CarForm';

export default async function EditCarPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const car = await adminCar(id);
  if (!car) notFound();

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">차량 수정 — {car.name}</h1>
      </div>
      <CarForm car={car} />
    </>
  );
}
