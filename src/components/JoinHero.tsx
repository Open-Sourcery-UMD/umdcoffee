import React from 'react';
import './JoinHero.css';

interface JoinHeroProps {
  eyebrow?: string;
  title?: string;
  highlightedTitle?: string;
  description?: string;
  imageSrc?: string;
}

export default function JoinHero({
  eyebrow = "FOR STUDENTS",
  title = "Find Your Seat at the ",
  highlightedTitle = "Coffee Bar",
  description = "Free coffee every week and a community open to everyone, coffee lover or not. Here's how to get involved.",
  imageSrc = "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1000&q=80"
}: JoinHeroProps) {
  return (
    <section className="join-hero-section">
      <div className="join-hero-card">
        {/* Left Text Content */}
        <div className="join-hero-content">
          <span className="join-hero-eyebrow">{eyebrow}</span>
          <h1 className="join-hero-title">
            {title}
            <span className="join-hero-highlight">{highlightedTitle}</span>
          </h1>
          <p className="join-hero-description">{description}</p>
        </div>

        {/* Right Image */}
        <div className="join-hero-image">
          <img src={imageSrc} alt="Latte art coffee cups on a wooden table" />
        </div>
      </div>
    </section>
  );
}