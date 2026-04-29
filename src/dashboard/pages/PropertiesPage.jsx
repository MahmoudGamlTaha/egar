import { T } from '../../translations';
import { Ico } from '../../components/Icon';
import { Pill } from '../../components/Pill';
import { PROPS } from '../../data';

import { useState } from 'react';
import { NewPropertyPage } from './NewPropertyPage';

export function PropertiesPage({ lang }) {
  const [showNew, setShowNew] = useState(false);
  const t = T[lang]; const cur = t.cur; const ar = lang === "ar";
  const typeLabel = tp => ({ apartment:ar?"شقة":"Apt", villa:ar?"فيلا":"Villa", office:ar?"مكتب":"Office", shop:ar?"محل":"Shop", warehouse:ar?"مستودع":"WH" }[tp] || tp);
  if (showNew) return <NewPropertyPage lang={lang} onBack={() => setShowNew(false)} />;

  return (
    <div className="anim">
      <div style={{ marginBottom:14 }}><h2 style={{ fontSize:18, fontWeight:800, marginBottom:2 }}>{t.nav.properties}</h2></div>
      <div className="card">
        <div className="card-head">
          <div className="card-title"><Ico n="properties" s={14} />{t.nav.properties}</div>
          <div style={{ display:"flex", gap:7 }}>
            <div className="searchbox"><Ico n="search" s={13} /><input placeholder={t.tbl.search} /></div>
            <button className="btn-tl" onClick={() => setShowNew(true)}><Ico n="plus" s={12} />{t.tbl.new}</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t.tbl.id}</th><th>{t.tbl.type}</th><th>{t.tbl.building}</th><th>{t.tbl.unit}</th><th>{t.tbl.floor}</th><th>{t.tbl.area}</th><th>{t.tbl.city}</th><th>{t.tbl.rent}</th><th>{t.tbl.status}</th><th>{t.tbl.action}</th></tr></thead>
            <tbody>
              {PROPS.map(r => (
                <tr key={r.id}>
                  <td><span className="mono">{r.id}</span></td>
                  <td><span style={{ fontSize:10, fontWeight:700, color:"var(--tl)" }}>{typeLabel(r.type)}</span></td>
                  <td><div style={{ fontWeight:500, fontSize:12 }}>{r.building}</div><div style={{ fontSize:10, color:"var(--t4)" }}>{r.district}</div></td>
                  <td style={{ fontWeight:600 }}>{r.unit}</td>
                  <td>{r.floor}</td>
                  <td>{r.area}م²</td>
                  <td>{r.city}</td>
                  <td style={{ fontWeight:700, color:"var(--tl)" }}>{r.rent.toLocaleString()} {cur}</td>
                  <td><Pill s={r.status} lang={lang} /></td>
                  <td>
                    <div style={{ display:"flex", gap:2 }}>
                      <button className="btn-icon" onClick={() => alert('View property ' + r.id)}><Ico n="eye" s={12} /></button>
                      <button className="btn-icon" onClick={() => alert('Edit property ' + r.id)}><Ico n="edit" s={12} /></button>
                      <button className="btn-icon" onClick={() => alert('Delete property ' + r.id)}><Ico n="trash" s={12} /></button>
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
