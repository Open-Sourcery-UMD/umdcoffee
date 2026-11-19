import { ArrowUpRight } from 'lucide-react';
import Button from './Button';
import './ResourcesHero.css';

function CoffeeBeans({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 60 60" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <ellipse cx="13" cy="24" rx="10" ry="15" transform="rotate(18 13 24)" />
        <ellipse cx="43" cy="15" rx="10" ry="15" transform="rotate(70 43 15)" />
        <ellipse cx="40" cy="44" rx="10" ry="15" transform="rotate(-45 40 44)" />
      </g>
      <g fill="none" stroke="var(--color-background)" strokeWidth="2" strokeLinecap="round">
        <path d="M15 11c-8 7 3 17-6 26M30 19c10-9 15 2 25-8M31 34c0 12 14 9 18 20" />
      </g>
    </svg>
  );
}

export default function ResourcesHero() {
  return (
    <section className="resources-hero" aria-labelledby="resources-hero-heading">
      <svg
        className="resources-hero-trails"
        viewBox="0 0 1280 764"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.55">
          <path d="M37 422C160 416 268 460 369 543M905 435C1012 390 1132 369 1242 356" />
        </g>
        <path d="M369 528c1 9 5 13 14 15-9 1-13 5-14 15-2-10-6-14-15-15 9-2 13-6 15-15Z" />
        <path
          className="resources-hero-sparkle"
          d="M905 417c2 11 7 16 18 18-11 2-16 7-18 18-2-11-7-16-18-18 11-2 16-7 18-18Z"
        />
      </svg>
      <p className="resources-hero-label">Resources</p>
      <h1 id="resources-hero-heading">
        Brew it
        <br />
        <em>yourself.</em>
      </h1>
      <div className="resources-hero-actions">
        <Button className="resources-hero-browse" href="#spotlight-recipes">
          Browse recipes <ArrowUpRight size={20} aria-hidden="true" focusable="false" />
        </Button>
        <Button className="resources-hero-tutorials" variant="light" href="#">
          Watch tutorials
        </Button>
      </div>
      <div className="resources-hero-art" aria-hidden="true">
        <CoffeeBeans className="resources-hero-beans resources-hero-beans-left" />
        <CoffeeBeans className="resources-hero-beans resources-hero-beans-right" />
        <img
          className="resources-hero-cup"
          src="/resources/coffee-cup.png"
          alt=""
          width={1008}
          height={980}
          fetchPriority="high"
        />
        <div className="resources-hero-sticker">
          <svg viewBox="0 0 128 128" focusable="false">
            <path d="M64 5Q72-3 78 8Q89 1 93 14Q106 11 107 24Q120 25 116 38Q130 43 122 54Q134 64 122 74Q130 85 116 90Q120 103 107 104Q106 117 93 114Q89 127 78 120Q72 131 64 123Q56 131 50 120Q39 127 35 114Q22 117 21 104Q8 103 12 90Q-2 85 6 74Q-6 64 6 54Q-2 43 12 38Q8 25 21 24Q22 11 35 14Q39 1 50 8Q56-3 64 5Z" />
          </svg>
          <span>
            Start
            <br />
            here →
          </span>
        </div>
      </div>
    </section>
  );
}
