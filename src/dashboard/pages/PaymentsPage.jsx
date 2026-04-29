import { T } from '../../translations';
import { Ico } from '../../components/Icon';
import { Pill } from '../../components/Pill';
import { PAYMENTS } from '../../data';

export function PaymentsPage({ lang }) {
  const t = T[lang]; const cur = t.cur; const ar = lang === "ar";
  return (
    <div className="anim">
      <div style={{ marginBottom:14 }}><h2 style={{ fontSize:18, fontWeight:800, marginBottom:2 }}>{t.nav.payments}</h2></div>
      <div className="card">
        <div className="card-head">
          <div className="card-title"><Ico n="payments" s={14} />{t.nav.payments}</div>
          <div style={{ display:"flex", gap:7 }}>
            <div className="searchbox"><Ico n="search" s={13} /><input placeholder={t.tbl.search} /></div>
            <button className="btn-ol"><Ico n="download" s={12} />{t.tbl.export}</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t.tbl.id}</th><th>{t.tbl.type}</th><th>{t.tbl.tenant}</th><th>{t.tbl.amount}</th><th>{t.tbl.due}</th><th>{t.tbl.paid}</th><th>{t.tbl.method}</th><th>{t.tbl.status}</th><th>{t.tbl.action}</th></tr></thead>
            <tbody>
              {PAYMENTS.map(r => (
                <tr key={r.id}>
                  <td><span className="mono">{r.id}</span></td>
                  <td><span className="mono">{r.contract}</span></td>
                  <td>{r.tenant}</td>
                  <td style={{ fontWeight:700 }}>{r.amount.toLocaleString()} {cur}</td>
                  <td className="mono">{r.due}</td>
                  <td className="mono" style={{ color: r.paid ? "var(--gn)" : "var(--t4)" }}>{r.paid || "—"}</td>
                  <td style={{ color:"var(--t3)", fontSize:12 }}>{r.method}</td>
                  <td><Pill s={r.status} lang={lang} /></td>
                  <td><button className="btn-icon"><Ico n="eye" s={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
