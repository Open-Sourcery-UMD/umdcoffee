import AboutHero from '../components/AboutHero';
import Mission from '../components/Mission';
import Values from '../components/Values';
import Team from '../components/Team';
import JoinCta from '../components/JoinCta';
import MemberCard from '../components/MemberCard';

export default function About() {
  return (
    <>
      <title>About | Coffee @ UMD</title>
      <AboutHero />
      <Mission />
      <Values />
      <Team />
      <section style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
        <MemberCard />
      </section>
      <JoinCta />
    </>
  );
}
