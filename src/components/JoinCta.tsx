import PunchCard from './PunchCard';
import './JoinCta.css';

// TODO(ABOUT-5): build the "Pull up a chair" CTA (with PunchCard).
// Root element: <section className="join-cta">. Renders nothing until built so pages don't shift.
export default function JoinCta() {
	return (
		<section className="join-cta">
			<PunchCard
				title="Pull up a chair"
				body="Stop by any weekly event. No sign-up, no experience, no cost. Bring a friend,
or come make one."
				button="Join the Club" />
		</section>
	)
}
