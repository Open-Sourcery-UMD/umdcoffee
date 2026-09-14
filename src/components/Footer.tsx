import FooterLinkColumn from './FooterLinkColumn';

export default function Footer() {
  return (
    <div className="footer-section">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/assets/icons/logo.svg" alt="Coffee Logo" />
          <p className="logo-text">
            Coffee
            <span style={{ color: 'oklch(73.229% 0.15551 25.739)' }}>
              {' '}
              @ University of Maryland{' '}
            </span>
          </p>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
          pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.
        </p>
        <div className="icon-list">
          <a href="https://github.com/Open-Sourcery-UMD/umdcoffee" className="icon">
            <img src="/assets/icons/github-icon.svg" alt="Coffee @ UMD Website Github" />
          </a>
          <a href="https://www.instagram.com/umdcoffee/" className="icon">
            <img src="/assets/icons/instagram-icon.svg" alt="Coffee @ UMD Instagram" />
          </a>
          <a href="/" className="icon">
            <img src="/assets/icons/discord-icon.svg" alt="Coffee @ UMD Discord" />
          </a>
          <a href="/" className="icon">
            <img src="/assets/icons/linkedin-icon.svg" alt="Coffee @ UMD LinkedIn" />
          </a>
          <a href="https://terplink.umd.edu/organization/coffee" className="icon">
            <img src="/assets/icons/terplink-icon.svg" alt="Coffee @ UMD TerpLink" />
          </a>
        </div>
      </div>
      <FooterLinkColumn title="Lorem ipsum" items={['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum']} />
      <FooterLinkColumn
        title="Lorem ipsum"
        items={['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum']}
      />
      <FooterLinkColumn title="Lorem ipsum" items={['Lorem ipsum', 'Lorem ipsum']} />
    </div>
  );
}
