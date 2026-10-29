// TODO(ABOUT-2): build the mission statement + "what we do" pills.
// Root element: <section className="mission">. Renders nothing until built so pages don't shift.
import './Mission.css';

interface Props {
  title: String;
}

function MenuItem(props: Props) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 className="primary-color" style={{ marginTop: 0 }}>
          {props.title}
        </h2>
        <div className="dotted-line"></div>
        <h3 className="subheading-color">Test</h3>
      </div>
      <p className="primary-color">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid id, dolores deserunt porro
        nesciunt animi magnam eaque sunt accusantium ea fuga hic nam enim perferendis, obcaecati
        iusto cupiditate neque earum!
      </p>
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
          <MenuItem title="Everyone's Welcome" />
          <MenuItem title="Craft, Not Product" />
          <MenuItem title="Ethically Sourced" />
          <MenuItem title="Coffee & Company" />
        </div>
      </section>
    </>
  );
}
