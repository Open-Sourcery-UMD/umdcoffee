import type { ReactNode } from 'react';
import Button from './Button';
import './ReusableCard.css';

interface ReusableCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick?: () => void;
}

export default function ReusableCard({
  icon,
  title,
  description,
  buttonLabel,
}: ReusableCardProps) {
  return (
    <section className="reusable-card">
      <div className="reusable-card-icon">
        {icon}
      </div>
      <div className="reusable-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <Button>{buttonLabel}</Button>
      </div>
    </section>
  );
}
