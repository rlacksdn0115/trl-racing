import { adminCars, adminMembers } from '@/lib/admin/queries';
import { RaceForm } from '../RaceForm';

export default async function NewRacePage() {
  const [members, cars] = await Promise.all([adminMembers(), adminCars()]);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-title">경기 등록</h1>
      </div>
      <RaceForm members={members} cars={cars} />
    </>
  );
}
