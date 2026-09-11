interface FaqTabProps {
  icon: string;
  label: string;
}

export default function FaqTab({ icon, label }: FaqTabProps) {
  return (
    <div className="faq-tab">
      <span className="tab-icon">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
