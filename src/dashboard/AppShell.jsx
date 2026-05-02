import { useState, useRef, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { T } from '../translations';
import { Ico } from '../components/Icon';
import { Pill } from '../components/Pill';
import { SIDENAV, AV_COLOR } from './config';
import { CONTRACTS } from '../data';
import { ContractApprovalModal } from './pages/ContractApprovalModal';
import { HomePage } from './HomePage';
import { ContractsPage } from './pages/ContractsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { UsersPage } from './pages/UsersPage';
import { NewContractPage } from './pages/NewContractPage';
import { PropertyHistoryPage } from './pages/PropertyHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { WalletPage } from './pages/WalletPage';
import { MetricGrid } from './MetricGrid';

export function AppShell({ user, lang, setLang, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const page = location.pathname.split('/').pop() || 'home';
  const t  = T[lang];
  const ar = lang === "ar";
  const role = user.role;
  user.nid = user.nid || "2XXXXXXXXXXX";
  user.phone = user.phone || "01XXXXXXXXX";
  const navGroups = SIDENAV[role] || SIDENAV.tenant;

  /* ── Notifications state ── */
  const [showNotif, setShowNotif] = useState(false);
  const [contracts, setContracts] = useState(CONTRACTS);
  const [notifContract, setNotifContract] = useState(null);
  const notifRef = useRef(null);
  const pendingContracts = contracts.filter(c => c.status === 'pending');

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleNotifApprove(id) {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c));
  }
  function handleNotifReject(id) {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status: 'terminated' } : c));
  }

  function navLabel(k) { return t.nav[k] || k; }

  const pageTitle = navLabel(page);

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
                <NavLink key={item.k} to={item.path} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                  <span style={{ width:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Ico n={item.ic} s={14} />
                  </span>
                  <span className="nav-label">{navLabel(item.k)}</span>
                  {item.b && <span className="nav-badge">{item.b}</span>}
                </NavLink>
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
            <div className="notif-wrap" ref={notifRef}>
              <button className="topbar-icon" onClick={() => setShowNotif(!showNotif)} style={{ position: 'relative' }}>
                <Ico n="bell" s={14} />
                {pendingContracts.length > 0 && <span className="notif-badge">{pendingContracts.length}</span>}
              </button>
              {showNotif && (
                <div className="notif-dropdown anim">
                  <div className="notif-head">
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{ar ? 'الإشعارات' : 'Notifications'}</span>
                    <span style={{ fontSize: 11, color: 'var(--t3)' }}>{pendingContracts.length} {ar ? 'جديد' : 'new'}</span>
                  </div>
                  {pendingContracts.length === 0 ? (
                    <div className="notif-empty">{ar ? 'لا توجد إشعارات جديدة' : 'No new notifications'}</div>
                  ) : (
                    pendingContracts.map(c => (
                      <div key={c.id} className="notif-item">
                        <div className="notif-item-top">
                          <Ico n="contracts" s={13} />
                          <span style={{ fontWeight: 700, fontSize: 12 }}>{ar ? 'طلب موافقة عقد إيجار' : 'Rental contract approval request'}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', margin: '4px 0 8px 21px' }}>
                          {c.id} — {c.property} — {c.tenant}
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginLeft: 21 }}>
                          <button className="btn-tl btn-sm" onClick={() => handleNotifApprove(c.id)}><Ico n="check" s={10} />{ar ? 'موافقة' : 'Approve'}</button>
                          <button className="btn-ol btn-sm" onClick={() => handleNotifReject(c.id)}>{ar ? 'رفض' : 'Reject'}</button>
                          <button className="btn-ol btn-sm" onClick={() => { setShowNotif(false); setNotifContract(c); }}>{ar ? 'عرض' : 'View'}</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div onClick={() => navigate('/dashboard/profile')} style={{ width:29, height:29, borderRadius:"50%", background:AV_COLOR[role], display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", cursor:"pointer", flexShrink:0 }} title={ar ? 'الملف الشخصي' : 'Profile'}>
              {user.av}
            </div>
          </div>
        </div>
        <div className="page-content">
          <Routes>
            <Route path="home" element={<HomePage role={role} lang={lang} user={user} />} />
            <Route path="contracts" element={<ContractsPage lang={lang} role={role} />} />
            <Route path="contracts/new" element={<NewContractPage user={user} lang={lang} />} />
            <Route path="payments" element={<PaymentsPage lang={lang} />} />
            <Route path="properties" element={<PropertiesPage lang={lang} user={user} />} />
            <Route path="users" element={<UsersPage lang={lang} />} />
            <Route path="properties/:propertyId/history" element={<PropertyHistoryPage lang={lang} />} />
            <Route path="profile" element={<ProfilePage user={user} lang={lang} />} />
            <Route path="wallet" element={<WalletPage lang={lang} />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
      {notifContract && (
        <ContractApprovalModal
          contract={notifContract}
          lang={lang}
          role={role}
          onClose={() => setNotifContract(null)}
          onApprove={() => {
            setContracts(prev => prev.map(c => c.id === notifContract.id ? { ...c, status: 'active' } : c));
            setNotifContract(null);
          }}
          onReject={() => {
            setContracts(prev => prev.map(c => c.id === notifContract.id ? { ...c, status: 'terminated' } : c));
            setNotifContract(null);
          }}
        />
      )}
    </div>
  );
}
