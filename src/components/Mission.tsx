// TODO(ABOUT-2): build the mission statement + "what we do" pills.
// Root element: <section className="mission">. Renders nothing until built so pages don't shift.
import './Mission.css';

interface Props {
  title: String;
  subtitle: String;
  content: String;
  iconName: String;
}

function MenuItem(props: Props) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={`public/assets/icons/${props.iconName}`} alt="" />
        <h2 className="primary-color" style={{ marginTop: 0, fontSize: 27.65 }}>
          {props.title}
        </h2>
        <div className="dotted-line"></div>
        <h3 className="subheading-color" style={{ fontSize: 19.2 }}>
          {props.subtitle}
        </h3>
      </div>
      <p className="primary-color">{props.content}</p>
    </div>
  );
}

export default function Mission() {
  return (
    <>
      <section className="values-section">
        <h1 style={{ textAlign: 'center' }} className="primary-color">
          What We Value
        </h1>
        <div className="item-frame">
          <MenuItem
            title="Everyone's Welcome"
            subtitle="All levels"
            content="Coffee lovers, coffee skeptics, and people who've never heard of specialty coffee. There's a cup and a seat for you."
            iconName="users-icon.svg"
          />
          <MenuItem
            title="Craft, Not Product"
            subtitle="Small roasters"
            content="We treat coffee as a craft and lift up smaller, unique businesses, from roasters to milk makers to gear."
            iconName="coffee-icon.svg"
          />
          <MenuItem
            title="Ethically Sourced"
            subtitle="Direct trade"
            content="We only partner with direct-trade or Fairtrade roasters and companies with ethical business practices."
            iconName="bean-icon.svg"
          />
          <MenuItem
            title="Coffee & Company"
            subtitle="Equal parts"
            content="Specialty coffee and socializing get equal billing. Come for a cup, stay for the people."
            iconName="sofa-icon.svg"
          />
        </div>
      </section>
    </>
  );
}
