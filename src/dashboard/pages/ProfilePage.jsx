import { useState } from 'react';
import { T } from '../../translations';
import { Ico } from '../../components/Icon';
import { Pill } from '../../components/Pill';

export function ProfilePage({ user, lang }) {
  const t = T[lang];
  const ar = lang === "ar";
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '01XXXXXXXXX',
    email: user.email || `${user.av}@mail.com`,
    nid: user.nid || '2XXXXXXXXXXX',
  });

  const roleColor = { tenant: '#0891B2', landlord: '#1A4A6E', company: '#D97706', admin: '#DC2626' }[user.role] || '#0891B2';

  const fields = [
    { key: 'name',  label: ar ? 'الاسم الكامل' : 'Full Name',       icon: 'users',       type: 'text' },
    { key: 'nid',   label: ar ? 'الرقم القومي' : 'National ID',      icon: 'key',          type: 'text' },
    { key: 'phone', label: ar ? 'رقم الهاتف' : 'Phone Number',       icon: 'bell',         type: 'tel' },
    { key: 'email', label: ar ? 'البريد الإلكتروني' : 'Email',       icon: 'globe',        type: 'email' },
  ];

  return (
    <div className="anim">
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>{ar ? 'الملف الشخصي' : 'My Profile'}</h2>
        <p style={{ fontSize: 11, color: 'var(--t4)' }}>{ar ? 'إدارة بياناتك الشخصية وإعدادات الحساب' : 'Manage your personal info and account settings'}</p>
      </div>

      {/* Profile header card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 18, padding: '24px 20px',
          background: `linear-gradient(135deg, ${roleColor}18, ${roleColor}08)`,
          borderRadius: 'var(--r3)',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: roleColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0,
            border: `3px solid ${roleColor}44`,
          }}>
            {user.av}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>{user.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Pill s="verified" lang={lang} />
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>{t.roles[user.role]}</span>
              <span style={{ fontSize: 10, color: 'var(--t4)' }}>•</span>
              <span style={{ fontSize: 11, color: 'var(--t4)' }}>{ar ? 'عضو منذ' : 'Member since'} 2024</span>
            </div>
          </div>
          <button
            className={editing ? 'btn-ol' : 'btn-tl'}
            onClick={() => setEditing(!editing)}
          >
            <Ico n={editing ? 'x' : 'edit'} s={12} />
            {editing ? (ar ? 'إلغاء' : 'Cancel') : (ar ? 'تعديل' : 'Edit')}
          </button>
        </div>
      </div>

      {/* Info fields */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <div className="card-title"><Ico n="users" s={14} />{ar ? 'البيانات الشخصية' : 'Personal Information'}</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gap: 14 }}>
            {fields.map(f => (
              <div key={f.key} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', background: 'var(--w1)', border: '1px solid var(--b1)',
                borderRadius: 'var(--r2)',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 'var(--r2)', background: 'var(--tlbg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Ico n={f.icon} s={13} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                    {f.label}
                  </div>
                  {editing ? (
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={{
                        width: '100%', padding: '6px 10px', fontSize: 13, fontWeight: 600,
                        border: '1px solid var(--tl)', borderRadius: 'var(--r2)',
                        background: 'var(--w0)', color: 'var(--t1)', fontFamily: 'inherit',
                        outline: 'none',
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{form[f.key]}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {editing && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button className="btn-ol" onClick={() => setEditing(false)}>{ar ? 'إلغاء' : 'Cancel'}</button>
              <button className="btn-tl" onClick={() => setEditing(false)}>
                <Ico n="check" s={12} />{ar ? 'حفظ التغييرات' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Account settings */}
      <div className="card">
        <div className="card-head">
          <div className="card-title"><Ico n="settings" s={14} />{ar ? 'إعدادات الحساب' : 'Account Settings'}</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { label: ar ? 'تغيير كلمة المرور' : 'Change Password', icon: 'key', desc: ar ? 'تحديث كلمة المرور الخاصة بك' : 'Update your password' },
              { label: ar ? 'تفعيل المصادقة الثنائية' : 'Enable Two-Factor Auth', icon: 'shield', desc: ar ? 'حماية إضافية لحسابك' : 'Extra protection for your account' },
              { label: ar ? 'تفضيلات الإشعارات' : 'Notification Preferences', icon: 'bell', desc: ar ? 'إدارة طريقة استلام الإشعارات' : 'Manage how you receive notifications' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', background: 'var(--w1)', border: '1px solid var(--b1)',
                borderRadius: 'var(--r2)', cursor: 'pointer', transition: 'background .15s',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 'var(--r2)', background: 'var(--tlbg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Ico n={item.icon} s={13} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 1 }}>{item.desc}</div>
                </div>
                <Ico n={ar ? "chevL" : "chevR"} s={12} style={{ color: 'var(--t3)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
