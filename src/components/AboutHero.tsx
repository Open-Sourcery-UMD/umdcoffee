import './AboutHero.css';
import Button from './Button';

export default function AboutHero() {
  return (
    <section className="about-hero">
      <img
        className="about-hero-image"
        src="/card-image-placeholder.png"
        alt=""
        fetchPriority="high"
      />
      <h1 className="about-hero-title">
        Brewing <span className="highlight">Community</span>
        <br />
        One Cup at a Time
      </h1>
      <p className="about-hero-description">
        UMD's specialty coffee social club, and maybe the biggest college coffee club on the planet.
        Free coffee, every week.
      </p>
      <Button variant="light">Join the Club</Button>
    </section>
  );
}
