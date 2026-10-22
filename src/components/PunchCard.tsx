import Button from './Button';
import './JoinCta.css'

interface PunchCardProps {
	title: string;
	body: string;
	button: string;
}

export default function PunchCard({ title, body, button }: PunchCardProps) {
	return (
		<div className="punch-card-container">
			<div className="punch-card-flex">
				<div>
					<div><h1>{title}</h1></div>
					<div><p>{body}</p></div>
					<div><Button variant="primary">{button}</Button></div>
				</div>
				<div>
					<img src="punch-card.svg"></img>
				</div>
			</div>
		</div>
	)
}