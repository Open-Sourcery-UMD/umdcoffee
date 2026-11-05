import Button from './Button';
import './Socials.css';

export default function Socials() {
  return (
    <section className="socials" aria-labelledby="socials-heading">
      <div className="socials-copy">
        <h2 id="socials-heading">Stay in the loop</h2>
        <p>Weekly social times and event updates get posted on our socials.</p>
      </div>
      <div className="socials-links">
        <Button
          className="socials-link"
          variant="light"
          href="https://www.instagram.com/umdcoffee/"
        >
          <img src="/assets/icons/instagram-icon.svg" alt="" width={24} height={24} />
          Instagram
        </Button>
        <Button className="socials-link" variant="light" href="#">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M20 3H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10l5 3v-3h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
            <path d="m10 7-2 8m8-8-2 8M7 10h11M6 13h11" />
          </svg>
          GroupMe
        </Button>
        <Button className="socials-link" variant="light" href="#">
          <img src="/assets/icons/discord-icon.svg" alt="" width={24} height={24} />
          Discord
        </Button>
      </div>
    </section>
  );
}
