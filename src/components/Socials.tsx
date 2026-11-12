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
          <img src="/assets/icons/groupme-icon.svg" alt="" width={24} height={24} />
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
