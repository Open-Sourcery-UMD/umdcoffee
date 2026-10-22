import './AboutHero.css';
import Button from './Button';

// TODO(ABOUT-1): build the About hero (photo banner + headline + Join button).
// Root element: <section className="about-hero">. Renders nothing until built so pages don't shift.
export default function AboutHero() {
  return (
    <section className="about-hero">
      <img className="about-hero-image" src="card-image-placeholder.png"/>
        <h1 className="about-hero-title">
          Brewing <span className="highlight">Community</span>
          <br />
          One Cup at a Time
        </h1>
        <p className="about-hero-description">
          UMD's specialty coffee social club, and maybe the biggest
          <br/>
          college coffee club on the planet. Free coffee, every week.
        </p>
        <Button className="button" variant="light">Join the Club</Button>
    </section>
  );
}
