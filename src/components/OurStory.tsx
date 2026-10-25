import Button from './Button';
import './OurStory.css';

export default function OurStory() {
  return (
    <section className="our-story" aria-labelledby="our-story-heading">
      <div className="our-story-main">
        {/* The full heading block is tracked in #22. */}
        <h2 id="our-story-heading">Our Story</h2>
        <div className="our-story-photo our-story-photo-large">
          <img
            src="/card-image-placeholder.png"
            alt="A barista in a brown apron pouring coffee into a paper cup"
            width={588}
            height={344}
            loading="lazy"
          />
        </div>
      </div>
      <div className="our-story-details">
        <div className="our-story-photos">
          <div className="our-story-photo our-story-photo-small">
            <img
              src="/card-image-placeholder.png"
              alt="Coffee being poured from a glass carafe into a paper cup"
              width={282}
              height={168}
              loading="lazy"
            />
          </div>
          <div className="our-story-photo our-story-photo-small">
            <img
              src="/card-image-placeholder.png"
              alt="A barista wearing a Dream Coffee apron while preparing coffee"
              width={282}
              height={168}
              loading="lazy"
            />
          </div>
        </div>
        <Button to="/about" variant="primary">
          More about us
        </Button>
      </div>
    </section>
  );
}
