import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { AtSign } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { getMemberBySlug, getRacesByMember } from '@/lib/queries';
import { localized } from '@/lib/utils';
import { RaceScheduleCard } from '@/components/RaceScheduleCard/RaceScheduleCard';
import styles from './page.module.css';

export async function generateMetadata({
  params: { slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const member = await getMemberBySlug(slug);
  return { title: member ? `${member.name} — TRL Racing` : 'TRL Racing' };
}

export default async function MemberDetailPage({
  params: { slug },
}: {
  params: { locale: string; slug: string };
}) {
  const member = await getMemberBySlug(slug);
  if (!member) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('member');
  const races = await getRacesByMember(member.id);
  const bio = localized(member, 'bio', locale);
  const image = member.profile_image_url ?? member.helmet_image_url;
  const role = [member.field, t(`role.${member.role}`)].filter(Boolean).join(' · ');

  const profileRows = [
    { label: t('favoriteCar'), value: member.favorite_car },
    { label: t('favoriteTrack'), value: member.favorite_track },
    { label: t('birthYear'), value: member.birth_year?.toString() },
  ].filter((row) => row.value);

  const equipmentRows = [
    { label: t('wheelBase'), value: member.wheel_base },
    { label: t('pedal'), value: member.pedal },
  ].filter((row) => row.value);

  return (
    <>
      <section className={styles.hero}>
        <span className={styles.watermark} aria-hidden>
          {member.racing_number}
        </span>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.imageWrap}>
            {image && (
              <Image
                src={image}
                alt={`${member.name} helmet`}
                width={520}
                height={520}
                priority
                className={styles.image}
              />
            )}
          </div>

          <div className={styles.profile}>
            <p className={styles.number}>NO. {member.racing_number}</p>
            <h1 className={styles.name}>{member.name}</h1>
            <p className={styles.role}>{role}</p>
            {bio && <p className={styles.bio}>{bio}</p>}

            <dl className={styles.dataGrid}>
              {profileRows.map((row) => (
                <div key={row.label} className={styles.dataRow}>
                  <dt className={styles.dataLabel}>{row.label}</dt>
                  <dd className={styles.dataValue}>{row.value}</dd>
                </div>
              ))}
              {equipmentRows.map((row) => (
                <div key={row.label} className={styles.dataRow}>
                  <dt className={styles.dataLabel}>{row.label}</dt>
                  <dd className={styles.dataValue}>{row.value}</dd>
                </div>
              ))}
              {member.instagram && (
                <div className={styles.dataRow}>
                  <dt className={styles.dataLabel}>{t('instagram')}</dt>
                  <dd className={styles.dataValue}>
                    <a
                      href={`https://instagram.com/${member.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.instagramLink}
                    >
                      <AtSign size={14} strokeWidth={1.75} aria-hidden />
                      {member.instagram}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      <section className={`section ${styles.historySection}`}>
        <div className="container">
          <h2 className={styles.historyTitle}>{t('raceHistory')}</h2>
          {races.length > 0 ? (
            <div className={styles.raceList}>
              {races.map((race) => (
                <RaceScheduleCard key={race.id} race={race} />
              ))}
            </div>
          ) : (
            <p className={styles.emptyRaces}>{t('noRaces')}</p>
          )}
        </div>
      </section>
    </>
  );
}
