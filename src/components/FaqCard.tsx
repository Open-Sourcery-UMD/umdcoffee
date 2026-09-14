import { useState } from 'react';

interface FaqCardProps {
  question: string;
  answer: string;
}

export default function FaqCard({ question, answer }: FaqCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={open ? 'faq-card open' : 'faq-card'}>
      <span className="faq-plus" onClick={() => setOpen(!open)}>
        +
      </span>
      <h3 className="faq-question">{question}</h3>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}
