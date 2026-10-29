import Button from './Button';
import './OurStory.css';

export default function OurStory() {
  return (
    <section className="our-story" aria-labelledby="our-story-heading">
      <div className="our-story-main">
        <div className="our-story-heading">
          <h2 id="our-story-heading">Our Story</h2>
          <p className="our-story-intro">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
            pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.
          </p>
          <p className="our-story-tagline">Dreaming of drinking more coffee...</p>
        </div>
        {/* TODO: swap the placeholder src for the real photos; each alt already describes its final photo. */}
        <img
          className="our-story-photo our-story-photo-large"
          src="/card-image-placeholder.png"
          alt="A barista in a brown apron pouring coffee into a paper cup"
          width={588}
          height={344}
          loading="lazy"
        />
      </div>
      <div className="our-story-details">
        <div className="our-story-photos">
          <img
            className="our-story-photo our-story-photo-small"
            src="/card-image-placeholder.png"
            alt="Coffee being poured from a glass carafe into a paper cup"
            width={282}
            height={168}
            loading="lazy"
          />
          <img
            className="our-story-photo our-story-photo-small"
            src="/card-image-placeholder.png"
            alt="A barista wearing a Dream Coffee apron while preparing coffee"
            width={282}
            height={168}
            loading="lazy"
          />
        </div>
        <Button to="/about" variant="primary">
          More about us
        </Button>
      </div>
    </section>
  );
}
