import './Team.css';

// TODO(ABOUT-4): build the officer name-tag grid (with OfficerNameTag).
// Root element: <section className="team">. Renders nothing until built so pages don't shift.

interface Props {
  name: String;
  role: String;
  order: String;
}

function OfficerCard(props: Props) {
  return (
    <div className="officer-card">
      <div className="hello-band">
        <p className="hello-text">HELLO, I'M</p>
      </div>
      <div className="officer-card-content">
        <img src="\photo-placeholder.svg" alt="" style={{ width: 88 }} />
        <h3 style={{ fontSize: 19.2 }}>{props.name}</h3>
        <p className="role-text">{props.role}</p>
        <div className="usual-order">
          <small>Usual order:</small>
          <p style={{ fontWeight: 700, fontSize: 13.33, marginBottom: 0 }}>{props.order}</p>
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  let names: String[] = [];
  for (let i = 0; i < 15; i++) {
    names.push('Officer name');
  }

  let roles: String[] = [];
  for (let i = 0; i < 15; i++) {
    roles.push('Role');
  }

  let orders: String[] = [];
  for (let i = 0; i < 15; i++) {
    orders.push('Usual order');
  }

  return (
    <div style={{ gap: 24 }}>
      <h2 style={{ fontSize: 27.65, gap: 8 }}>Meet the officers pouring your coffee</h2>
      <div className="card-container">
        {names.map((name, index) => (
          <OfficerCard name={name} role={roles[index]} order={orders[index]} />
        ))}
      </div>
    </div>
  );
}
