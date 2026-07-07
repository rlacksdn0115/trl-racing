import { notFound } from 'next/navigation';
import { adminCars, adminMembers, adminRace } from '@/lib/admin/queries';
import { RaceForm } from '../RaceForm';

export default async function EditRacePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [race, members, cars] = await Promise.all([
    adminRace(id),
    adminMembers(),
    adminCars(),
  ]);
  if (!race) notFound();

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">경기 수정 — {race.title_en}</h1>
      </div>
      <RaceForm race={race} members={members} cars={cars} />
    </>
  );
}
