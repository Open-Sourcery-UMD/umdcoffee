import JoinHero from '../components/JoinHero';
import MemberCard from '../components/MemberCard';
import './ForStudents.css';

export default function ForStudents() {
  const handleTerplinkClick = () => {
    window.open('https://terplink.umd.edu/organization/coffee', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <title>For Students | Coffee @ UMD</title>

      <JoinHero />

      <section className="ways-to-involve-section">
        <h2 className="ways-to-involve-heading">Ways to get involved</h2>

        <div className="ways-to-involve-grid">
          <div className="ways-left-column">
            <MemberCard onButtonClick={handleTerplinkClick} />
          </div>

          <div className="ways-right-column">
            {/* Right-side stacked cards will go here later */}
          </div>
        </div>
      </section>
    </>
  );
}