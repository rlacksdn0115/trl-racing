import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getMembers, getSettings } from '@/lib/queries';
import { PageHero } from '@/components/PageHero/PageHero';
import { DriverCard } from '@/components/DriverCard/DriverCard';
import { JoinTeamCTA } from '@/components/JoinTeamCTA/JoinTeamCTA';
import styles from './page.module.css';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: `${t('members')} — TRL Racing` };
}

export default async function MembersPage() {
  const t = await getTranslations('member');
  const [members, settings] = await Promise.all([getMembers(), getSettings()]);

  return (
    <>
      <PageHero label="MEMBERS" title={t('listTitle')} desc={t('listDesc')} />

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {members.map((member) => (
              <DriverCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      <JoinTeamCTA recruiting={settings.recruiting} />
    </>
  );
}
