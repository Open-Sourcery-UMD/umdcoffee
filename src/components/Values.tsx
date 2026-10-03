import { Bean, Coffee, Sofa, Users } from 'lucide-react';
import MenuItem from './MenuItem';
import './Values.css';

const values = [
  {
    icon: Users,
    name: "Everyone's Welcome",
    tag: 'All levels',
    description:
      "Coffee lovers, coffee skeptics, and people who've never heard of specialty coffee. There's a cup and a seat for you.",
  },
  {
    icon: Coffee,
    name: 'Craft, Not Product',
    tag: 'Small roasters',
    description:
      'We treat coffee as a craft and lift up smaller, unique businesses, from roasters to milk makers to gear.',
  },
  {
    icon: Bean,
    name: 'Ethically Sourced',
    tag: 'Direct trade',
    description:
      'We only partner with direct-trade or Fairtrade roasters and companies with ethical business practices.',
  },
  {
    icon: Sofa,
    name: 'Coffee & Company',
    tag: 'Equal parts',
    description:
      'Specialty coffee and socializing get equal billing. Come for a cup, stay for the people.',
  },
];

export default function Values() {
  return (
    <section className="values" aria-labelledby="values-title">
      <h2 id="values-title">What We Value</h2>
      <ul className="values-menu">
        {values.map((value) => (
          <MenuItem key={value.name} {...value} />
        ))}
      </ul>
    </section>
  );
}
