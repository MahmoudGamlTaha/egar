import { useNavigate } from 'react-router-dom';
import { T } from '../translations';
import { Ico } from '../components/Icon';
import { Pill } from '../components/Pill';
import { MetricGrid } from './MetricGrid';
import { CONTRACTS, PAYMENTS } from '../data';

export function HomePage({ role, lang, user }) {
  const navigate = useNavigate();
  const t  = T[lang];
  const ar = lang === "ar";
  const cur = t.cur;

  const metricSets = {
    tenant: [
      { label:t.metrics.contracts, value:"2",     color:"tl", icon:"contracts", nav: "contracts" },
      { label:t.metrics.rent,      value:"8,500", color:"gn", icon:"money", sub:cur },
      { label:t.metrics.pending,   value:"1",     color:"am", icon:"payments", nav: "payments" },
      { label:t.metrics.maint,     value:"1",     color:"rd", icon:"maintenance", nav: "maintenance" },
    ],
    landlord: [
      { label:t.metrics.units,     value:"5",      color:"tl", icon:"building", nav: "properties" },
      { label:t.metrics.collected, value:"58,800", color:"gn", icon:"money", sub:cur },
      { label:t.metrics.overdue,   value:"1",      color:"rd", icon:"payments", nav: "payments" },
      { label:t.metrics.tenants,   value:"4",      color:"bl", icon:"users", nav: "users" },
    ],
    company: [
      { label:t.metrics.properties, value:"24",      color:"tl", icon:"building", nav: "properties" },
      { label:t.metrics.revenue,    value:"186,400", color:"gn", icon:"money", sub:cur },
      { label:t.metrics.contracts,  value:"19",      color:"bl", icon:"contracts", nav: "contracts" },
      { label:t.metrics.disputes,   value:"2",       color:"am", icon:"reports", nav: "reports" },
    ],
    admin: [
      { label:t.metrics.users,    value:"12,840", color:"tl", icon:"users", nav: "users" },
      { label:t.metrics.contracts,value:"8,421",  color:"gn", icon:"contracts", nav: "contracts" },
      { label:t.metrics.revenue,  value:"42.8M",  color:"bl", icon:"money", sub:cur },
      { label:t.metrics.newRegs,  value:"348",    color:"am", icon:"reports", sub:t.thisMonth, nav: "reports" },
    ],
  };

  return (
    <div className="anim">
      <div style={{ marginBottom:18 }}>
        <h2 style={{ fontSize:19, fontWeight:800, color:"var(--t1)", marginBottom:2 }}>
          {t.welcome[role]} {user.name} 👋
        </h2>
        <p style={{ fontSize:11, color:"var(--t4)" }}>{t.now}</p>
      </div>
      <MetricGrid items={metricSets[role] || metricSets.tenant} onNav={(path) => navigate(`/dashboard/${path}`)} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div className="card">
          <div className="card-head">
            <div className="card-title"><Ico n="contracts" s={14} />{ar ? "أحدث العقود" : "Recent Contracts"}</div>
            <button className="btn-icon" onClick={() => navigate("/dashboard/contracts")}>{ar ? "الكل" : "All"} →</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{t.tbl.id}</th><th>{t.tbl.rent}</th><th>{t.tbl.status}</th></tr></thead>
              <tbody>
                {CONTRACTS.slice(0, 4).map(c => (
                  <tr key={c.id}>
                    <td><span className="mono">{c.id}</span><div style={{ fontSize:11, color:"var(--t4)" }}>{c.property}</div></td>
                    <td style={{ fontWeight:700, color:"var(--tl)" }}>{c.rent.toLocaleString()} {cur}</td>
                    <td><Pill s={c.status} lang={lang} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <div className="card-title"><Ico n="payments" s={14} />{ar ? "المدفوعات الأخيرة" : "Recent Payments"}</div>
            <button className="btn-icon" onClick={() => navigate("/dashboard/payments")}>{ar ? "الكل" : "All"} →</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{t.tbl.id}</th><th>{t.tbl.amount}</th><th>{t.tbl.status}</th></tr></thead>
              <tbody>
                {PAYMENTS.map(p => (
                  <tr key={p.id}>
                    <td><span className="mono">{p.id}</span><div style={{ fontSize:11, color:"var(--t4)" }}>{p.tenant}</div></td>
                    <td style={{ fontWeight:700 }}>{p.amount.toLocaleString()} {cur}</td>
                    <td><Pill s={p.status} lang={lang} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
