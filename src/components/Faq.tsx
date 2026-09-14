import FaqTab from './FaqTab';
import FaqCard from './FaqCard';

export default function Faq() {
  return (
    <section className="faq">
      <h2 className="faq-title">Common Questions Answered</h2>
      <p className="faq-subtitle">Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>

      <div className="faq-tabs">
        <FaqTab icon="☕" label="Coffee Secrets" />
        <FaqTab icon="✉️" label="Contact Us" />
        <FaqTab icon="👥" label="Joining the Club" />
        <FaqTab icon="📖" label="Coffee Blogs" />
        <FaqTab icon="📅" label="Hosting Events" />
      </div>

      <div className="faq-cards">
        <FaqCard
          question="What does your club do?"
          answer="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor."
        />
        <FaqCard
          question="How do I get started?"
          answer="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor."
        />
        <FaqCard
          question="How often do you meet?"
          answer="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor."
        />
        <FaqCard
          question="How do I collab with this club?"
          answer="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor."
        />
      </div>
    </section>
  );
}
