interface EventCardProps {
  imageSrc: string;
  imageAlt: string;
  label: string;
  date: string;
  title: string;
  body: string;
  ctaLabel: string;
}

export default function EventCard({
  imageSrc,
  imageAlt,
  label,
  date,
  title,
  body,
  ctaLabel,
}: EventCardProps) {
  return (
    <div className="card">
      <div className="card-image">
        <img src={imageSrc} alt={imageAlt} />
        <div className="card-image-border"></div>
      </div>
      <div className="card-content">
        <div className="card-content-header">
          <div className="card-content-header-label">
            <p>{label}</p>
          </div>
          <p className="card-content-header-date">{date}</p>
        </div>
        <div className="card-content-body">
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
        <button className="card-content-hero-action">
          <p>{ctaLabel}</p>
        </button>
      </div>
    </div>
  );
}
