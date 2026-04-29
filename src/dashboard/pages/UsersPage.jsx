import { T } from '../../translations';
import { Ico } from '../../components/Icon';
import { Pill } from '../../components/Pill';
import { USERS } from '../../data';

export function UsersPage({ lang }) {
  const t = T[lang]; const ar = lang === "ar";
  const rc = { tenant:"var(--bl)", landlord:"var(--tl)", company:"var(--am)", admin:"var(--rd)" };
  return (
    <div className="anim">
      <div style={{ marginBottom:14 }}><h2 style={{ fontSize:18, fontWeight:800, marginBottom:2 }}>{t.nav.users}</h2></div>
      <div className="card">
        <div className="card-head">
          <div className="card-title"><Ico n="users" s={14} />{t.nav.users}</div>
          <div style={{ display:"flex", gap:7 }}>
            <div className="searchbox"><Ico n="search" s={13} /><input placeholder={t.tbl.search} /></div>
            <button className="btn-tl"><Ico n="plus" s={12} />{t.tbl.new}</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t.tbl.id}</th><th>{t.tbl.name}</th><th>{t.tbl.phone}</th><th>{t.tbl.email}</th><th>{t.tbl.role}</th><th>{t.tbl.joined}</th><th>{t.tbl.contracts}</th><th>{t.tbl.status}</th><th>{t.tbl.action}</th></tr></thead>
            <tbody>
              {USERS.map(r => (
                <tr key={r.id}>
                  <td><span className="mono">{r.id}</span></td>
                  <td>{r.name}</td>
                  <td>{r.phone}</td>
                  <td>{r.email}</td>
                  <td><span style={{ fontWeight:600, color:rc[r.role] }}>{t.roles[r.role]}</span></td>
                  <td className="mono">{r.joined}</td>
                  <td>{r.contracts}</td>
                  <td><Pill s={r.status} lang={lang} /></td>
                  <td>
                    <div style={{ display:"flex", gap:2 }}>
                      <button className="btn-icon"><Ico n="eye" s={12} /></button>
                      <button className="btn-icon"><Ico n="edit" s={12} /></button>
                      <button className="btn-icon"><Ico n="trash" s={12} /></button>
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
