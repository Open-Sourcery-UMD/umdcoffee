export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="subtitle">University of Maryland</p>
        <h1>
          Dream of <span className="highlight">Coffee</span>
          <br />
          Coffee of <span className="highlight">Dreams</span>
        </h1>
        <p className="description">
          Want unlimited, free specialty coffee (and sometimes Matcha lattes and other goodies)
          every week? Want to kick back, relax or study, make new friends, and learn how to make
          coffee? Join <strong>Coffee @ UMD</strong> - UMD coolest club!
        </p>
        <a href="#" className="cta-button">
          Get Involved
        </a>
      </div>
      <div className="hero-image">
        <img src="/coffee-cup.png" alt="Coffee cup" />
      </div>
    </section>
  );
}
