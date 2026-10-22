import Button from './Button';
import './JoinCta.css'

interface PunchCardProps {
	title: string;
	body: string;
	button: string;
}

export default function PunchCard({ title, body, button }: PunchCardProps) {
	return (
		<div className="punch-card-box">
			<div className="punch-card-grid">
				<div className="punch-card-info">
					<h1>{title}</h1>
					<p>{body}</p>
					<Button variant="primary">{button}</Button>
				</div>
				<div className="punch-card">
					<p>test</p>
				</div>
			</div>
		</div>
	)
}