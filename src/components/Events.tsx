import EventCard from './EventCard';

export default function Events() {
  return (
    <section className="events-sec">
      <div className="events-sec-text">
        <p>EVENTS</p>
        <h2>Join us in our weekly events!</h2>
      </div>
      <div className="events-sec-cards">
        <EventCard
          imageSrc="/card-image-placeholder.png"
          imageAlt="Barista pouring coffee into a cup"
          label="Lorem"
          date="July 31, 2025"
          title="Lorem Ipsum"
          body="Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat."
          ctaLabel="Get Involved"
        />
        <EventCard
          imageSrc="/card-image-placeholder.png"
          imageAlt="Barista pouring coffee into a cup"
          label="Lorem"
          date="July 31, 2025"
          title="Lorem Ipsum"
          body="Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat."
          ctaLabel="Get Involved"
        />
        <EventCard
          imageSrc="/card-image-placeholder.png"
          imageAlt="Barista pouring coffee into a cup"
          label="Lorem"
          date="July 31, 2025"
          title="Lorem Ipsum"
          body="Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat."
          ctaLabel="Get Involved"
        />
      </div>
    </section>
  );
}
