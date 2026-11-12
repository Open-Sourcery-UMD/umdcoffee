import './MemberCard.css';

interface MemberCardProps {
  imageSrc?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function MemberCard({
  imageSrc = "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80",
  title = "Join as a member",
  description = "Register on Terplink to become an official member of Coffee@UMD and keep up with club news.",
  buttonText = "Join on Terplink",
  onButtonClick
}: MemberCardProps) {
  return (
    <div className="card member-card">
      <div className="card-image">
        <img src={imageSrc} alt={title} />
      </div>

      <div className="card-content">
        <div className="card-icon-badge" aria-hidden="true">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 1 0 7.75" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>

        <div className="card-content-body">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <button 
          className="card-content-hero-action" 
          onClick={onButtonClick}
          type="button"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}