import Button from './Button';
import PunchCard from './PunchCard';
import './JoinCta.css';

export default function JoinCta() {
  return (
    <section className="join-cta">
      <div>
        <h2>Pull up a chair</h2>
        <p>
          Stop by any weekly event. No sign-up, no experience, no cost. Bring a friend, or come make
          one.
        </p>
        {/* Destination is an open question in the About tickets; empty href matches the Navbar's Join (K3). */}
        <Button variant="primary" href="">
          Join the Club
        </Button>
      </div>
      <PunchCard />
    </section>
  );
}
