// TODO(ABOUT-2): build the mission statement + "what we do" pills.
// Root element: <section className="mission">. Renders nothing until built so pages don't shift.
import Button from './Button';

export default function Mission() {
  return (
    <>
      <h2 style={{ textAlign: 'center', marginTop: 50 }}>Our mission</h2>
      <p style={{ textAlign: 'center' }}>
        We bring students together over <span className="highlight">free coffee</span> and help them
        bring specialty coffee into their own lives.
      </p>
      <ul className="pill-list">
        <li>Weekly coffee socials</li>
        <li>Collabs with clubs across campus</li>
        <li>Specialty coffee partnerships</li>
        <li>Free barista classes</li>
        <li>Free barista classes</li>
      </ul>
    </>
  );
}
