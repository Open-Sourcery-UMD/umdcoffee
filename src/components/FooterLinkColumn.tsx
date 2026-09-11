interface FooterLinkColumnProps {
  title: string;
  items: string[];
}

export default function FooterLinkColumn({ title, items }: FooterLinkColumnProps) {
  return (
    <div className="links">
      <h1>{title}</h1>
      {items.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
}
