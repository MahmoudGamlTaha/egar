import { T } from '../../translations';
import { Ico } from '../../components/Icon';
import { Pill } from '../../components/Pill';
import { CONTRACTS } from '../../data';

export function ContractsPage({ lang, onNew }) {
  const t = T[lang]; const cur = t.cur; const ar = lang === "ar";
  return (
    <div className="anim">
      <div style={{ marginBottom:14 }}>
        <h2 style={{ fontSize:18, fontWeight:800, marginBottom:2 }}>{t.nav.contracts}</h2>
        <p style={{ fontSize:11, color:"var(--t4)" }}>{ar ? "إدارة جميع العقود المسجلة" : "Manage all registered contracts"}</p>
      </div>
      <div className="card">
        <div className="card-head">
          <div className="card-title"><Ico n="contracts" s={14} />{t.nav.contracts} <span style={{ fontWeight:400, fontSize:11, color:"var(--t4)" }}>({CONTRACTS.length})</span></div>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", alignItems:"center" }}>
            <div className="searchbox"><Ico n="search" s={13} /><input placeholder={t.tbl.search} /></div>
            <button className="btn-ol btn-sm"><Ico n="filter" s={12} />{t.tbl.filter}</button>
            <button className="btn-ol"><Ico n="download" s={12} />{t.tbl.export}</button>
            <button className="btn-tl" onClick={onNew}><Ico n="plus" s={12} />{t.tbl.new}</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t.tbl.id}</th><th>{t.tbl.type}</th><th>{t.tbl.property}</th><th>{t.tbl.tenant}</th><th>{t.tbl.rent}</th><th>{t.tbl.start}</th><th>{t.tbl.end}</th><th>{t.tbl.deposit}</th><th>{t.tbl.status}</th><th>{t.tbl.action}</th></tr></thead>
            <tbody>
              {CONTRACTS.map(r => (
                <tr key={r.id}>
                  <td><span className="mono">{r.id}</span></td>
                  <td><span className={`pill ${r.type === "residential" ? "active" : "pending"}`} style={{ fontSize:9 }}>{r.type === "residential" ? (ar?"سكني":"Res.") : (ar?"تجاري":"Com.")}</span></td>
                  <td><div style={{ fontWeight:500, fontSize:12 }}>{r.property}</div><div style={{ fontSize:10, color:"var(--t4)" }}>{r.city}</div></td>
                  <td style={{ fontSize:12 }}>{r.tenant}</td>
                  <td style={{ fontWeight:700, color:"var(--tl)" }}>{r.rent.toLocaleString()} {cur}</td>
                  <td className="mono">{r.start}</td>
                  <td className="mono">{r.end}</td>
                  <td style={{ fontSize:12 }}>{r.deposit.toLocaleString()} {cur}</td>
                  <td><Pill s={r.status} lang={lang} /></td>
                  <td>
                    <div style={{ display:"flex", gap:2 }}>
                      <button className="btn-icon"><Ico n="eye" s={12} /></button>
                      <button className="btn-icon"><Ico n="edit" s={12} /></button>
                      <button className="btn-icon"><Ico n="download" s={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
