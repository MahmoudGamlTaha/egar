import { useState } from 'react';
import { T } from '../translations';
import { Ico } from '../components/Icon';
import { SIDENAV, AV_COLOR } from './config';
import { HomePage } from './HomePage';
import { ContractsPage } from './pages/ContractsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { UsersPage } from './pages/UsersPage';
import { NewContractPage } from './pages/NewContractPage';
import { MetricGrid } from './MetricGrid';

export function AppShell({ user, lang, setLang, onLogout }) {
  const [page, setPage]   = useState("home");
  const [newC, setNewC]   = useState(false);
  const t  = T[lang];
  const ar = lang === "ar";
  const role = user.role;
  user.nid = user.nid || "2XXXXXXXXXXX";
  user.phone = user.phone || "01XXXXXXXXX";
  const navGroups = SIDENAV[role] || SIDENAV.tenant;

  function navLabel(k) { return t.nav[k] || k; }

  function renderPage() {
    if (newC) return <NewContractPage user={user} lang={lang} onBack={() => setNewC(false)} />;
    switch (page) {
      case "home":       return <HomePage role={role} lang={lang} user={user} onNav={k => { setPage(k); setNewC(false); }} />;
      case "contracts":  return <ContractsPage lang={lang} onNew={() => setNewC(true)} />;
      case "payments":   return <PaymentsPage lang={lang} />;
      case "properties": return <PropertiesPage lang={lang} />;
      case "users":      return <UsersPage lang={lang} />;
      case "reports":    return (
        <div className="anim">
          <h2 style={{ fontSize:18, fontWeight:800, marginBottom:16 }}>{t.nav.reports}</h2>
          <MetricGrid items={[
            { label:ar?"إجمالي الإيرادات":"Total Revenue",  value:"42.8M",  color:"tl", icon:"money",     sub:t.cur },
            { label:ar?"نسبة الإشغال":"Occupancy Rate",     value:"87%",    color:"gn", icon:"building" },
            { label:ar?"متوسط الإيجار":"Avg Rent",          value:"13,460", color:"bl", icon:"reports",   sub:t.cur },
            { label:ar?"نزاعات مفتوحة":"Open Disputes",     value:"5",      color:"am", icon:"maintenance" },
          ]} />
          <div className="notice info"><Ico n="bell" s={13} />{ar?"التقارير التفصيلية قريباً.":"Detailed analytics coming soon."}</div>
        </div>
      );
      case "maintenance": return (
        <div className="anim">
          <h2 style={{ fontSize:18, fontWeight:800, marginBottom:14 }}>{t.nav.maintenance}</h2>
          <div className="notice warn"><Ico n="maintenance" s={13} />{ar?"طلب مفتوح: تسرب مياه — شقة 4B، المعادي":"Open request: Water leak — Unit 4B, Maadi"}</div>
        </div>
      );
      case "settings": return (
        <div className="anim">
          <h2 style={{ fontSize:18, fontWeight:800, marginBottom:14 }}>{t.nav.settings}</h2>
          <div className="card">
            <div className="card-body">
              <div className="fgroup" style={{ marginBottom:14 }}>
                <div className="frow"><label className="flabel">{ar?"الاسم":"Name"}</label><input className="finput" defaultValue={user.name} /></div>
                <div className="frow"><label className="flabel">{ar?"الهاتف":"Phone"}</label><input className="finput" defaultValue={user.phone} /></div>
                <div className="frow"><label className="flabel">{ar?"اللغة":"Language"}</label>
                  <select className="field-sel" value={lang} onChange={e => setLang(e.target.value)}>
                    <option value="ar">العربية</option><option value="en">English</option>
                  </select>
                </div>
              </div>
              <button className="btn-tl">{ar?"حفظ التغييرات":"Save Changes"}</button>
            </div>
          </div>
        </div>
      );
      default: return <HomePage role={role} lang={lang} user={user} onNav={setPage} />;
    }
  }

  const pageTitle = newC ? (ar?"عقد جديد":"New Contract") : navLabel(page);

  return (
    <div className={`app-shell ${lang}`} dir={t.dir}>
      {/* ── SIDEBAR ── */}
      <div className="sidebar">
        <div className="sidebar-head">
          <div className="sidebar-logo">إ</div>
          <div><div className="sidebar-appname">{t.app}</div><div className="sidebar-role">{t.roles[role]}</div></div>
        </div>
        <div className="sidebar-nav">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {group.sec && <div className="nav-section">{t.nav[group.sec] || group.sec}</div>}
              {group.items.map(item => (
                <div key={item.k}
                  className={`nav-item${page === item.k && !newC ? " active" : ""}`}
                  onClick={() => { setPage(item.k); setNewC(false); }}>
                  <span style={{ width:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Ico n={item.ic} s={14} />
                  </span>
                  <span className="nav-label">{navLabel(item.k)}</span>
                  {item.b && <span className="nav-badge">{item.b}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="sidebar-foot">
          <div className="sidebar-user" onClick={onLogout} title={t.logout}>
            <div className="user-av" style={{ background: AV_COLOR[role] }}>{user.av}</div>
            <div style={{ overflow:"hidden", flex:1 }}>
              <div className="user-name">{user.name}</div>
              <div className="user-role">{t.logout}</div>
            </div>
            <Ico n="logout" s={13} style={{ color:"rgba(255,255,255,.3)" }} />
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="main-area">
        <div className="topbar">
          <div className="topbar-title">{pageTitle}</div>
          <div className="topbar-right">
            <button className="lang-btn" onClick={() => setLang(l => l === "ar" ? "en" : "ar")}>
              <Ico n="globe" s={11} />{ar ? "English" : "عربي"}
            </button>
            <div className="topbar-icon"><Ico n="bell" s={14} /></div>
            <div style={{ width:29, height:29, borderRadius:"50%", background:AV_COLOR[role], display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", cursor:"pointer", flexShrink:0 }}>
              {user.av}
            </div>
          </div>
        </div>
        <div className="page-content">{renderPage()}</div>
      </div>
    </div>
  );
}
