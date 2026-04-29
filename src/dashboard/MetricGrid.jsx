import { Ico } from '../components/Icon';

export function MetricGrid({ items, onNav }) {
  return (
    <div className="metrics-grid">
      {items.map((m, i) => (
        <button key={i} className={`metric ${m.color}`} onClick={() => onNav(m.nav)}>
          <div className={`metric-icon ${m.color}`}><Ico n={m.icon} s={16} /></div>
          <div className="metric-label">{m.label}</div>
          <div className="metric-value">{m.value}</div>
          {m.sub && <div className="metric-sub">{m.sub}</div>}
        </button>
      ))}
    </div>
  );
}
