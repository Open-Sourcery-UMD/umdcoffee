import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

interface ButtonProps {
  variant?: 'primary' | 'light';
  children: ReactNode;
  className?: string;
  /** Internal route, rendered as a React Router link. */
  to?: string;
  /** External URL, rendered as a plain anchor. */
  href?: string;
  onClick?: () => void;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  to,
  href,
  onClick,
}: ButtonProps) {
  const classes = `button button-${variant} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
